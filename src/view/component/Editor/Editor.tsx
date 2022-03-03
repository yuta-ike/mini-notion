import React, { useRef, useState } from "react"
import classNames from "classnames"
import { Block, blockTypes } from "../../../type/Editor"
import BlockComponent, { BlockFocus } from "./Block"
import parseBlock from "../../../utils/parseBlock"
import { useEditorContextValue, useSetEditorContext } from "./context"

export type EditorProps = {
  className?: string
}

const initBlock = {
  content: "",
  type: "p" as const,
  depth: 0,
}

const Editor: React.VFC<EditorProps> = ({ className }) => {
  const [blocks, setBlocks] = useState<Block[]>([initBlock])
  const blockRefs = useRef<(HTMLTextAreaElement | null)[]>([])
  const blockFocusRef = useRef<({ blockFocus: BlockFocus } | null)[]>([])
  const setEditorContext = useSetEditorContext()
  const { selectMode } = useEditorContextValue()

  return (
    <>
      <div
        className={classNames(
          "rounded border border-slate-200 bg-white px-8 py-6 shadow-md",
          className,
        )}
        onPointerDown={() => setEditorContext({ selectMode: true })}
        onPointerUp={() => setEditorContext({ selectMode: false })}
      >
        {blocks.map((block, i) => (
          <BlockComponent
            key={i}
            ref={(ref) => (blockRefs.current[i] = ref)}
            blockFocus={(ref) => (blockFocusRef.current[i] = ref)}
            block={block}
            onKeyDown={(e, caretPosY) => {
              // caret
              const selectionStart = blockRefs.current[i]?.selectionStart
              const selectionEnd = blockRefs.current[i]?.selectionEnd
              const isCaretFirst =
                selectionStart != null && selectionStart === selectionEnd && selectionStart === 0
              const isCaretLast =
                selectionStart != null &&
                selectionStart === selectionEnd &&
                selectionStart === block.content.length

              // BackSpace
              if (e.key === "Backspace") {
                const caretOffset = blocks[i - 1]?.content?.length ?? 0
                if (block.content.length === 0 && block.depth === 0) {
                  e.preventDefault()
                  setBlocks((blocks) => {
                    const newBlocks = [...blocks]
                    if (block.type === initBlock.type) {
                      // 消す
                      newBlocks.splice(i, 1)
                      blockFocusRef.current[i - 1]?.blockFocus(caretOffset)
                    } else {
                      // タイプをリセット
                      newBlocks.splice(i, 1, initBlock)
                    }
                    return newBlocks
                  })
                } else if (isCaretFirst) {
                  if (block.type !== initBlock.type) {
                    // スタイルを削除
                    setBlocks((blocks) => {
                      const newBlocks = [...blocks]
                      const depth = Math.max(block.depth - 1, 0)
                      newBlocks.splice(i, 1, {
                        ...block,
                        type: initBlock.type,
                        depth,
                      })
                      return newBlocks
                    })
                  } else if (0 < block.depth) {
                    // ネストを下げる
                    setBlocks((blocks) => {
                      const newBlocks = [...blocks]
                      newBlocks.splice(i, 1, { ...block, depth: block.depth - 1 })
                      return newBlocks
                    })
                    // TODO: 箇条書きの整合性チェック（ネストが開いた箇条書きが生成されてしまう）
                  } else {
                    // 前のブロックとマージ
                    setBlocks((blocks) => {
                      const newBlocks = [...blocks]
                      newBlocks.splice(i - 1, 2, {
                        ...newBlocks[i - 1],
                        content: newBlocks[i - 1].content + blocks[i].content,
                      })
                      return newBlocks
                    })
                    blockFocusRef.current[i - 1]?.blockFocus(caretOffset)
                  }
                }
              }

              // Arrow Up / Down
              if (e.key === "ArrowUp" && caretPosY.isFirst) {
                e.preventDefault()
                const start = blockRefs.current[i]?.selectionStart ?? 0
                blockFocusRef.current[i - 1]?.blockFocus(start, start, caretPosY.left)
              } else if (e.key === "ArrowDown" && caretPosY.isLast) {
                e.preventDefault()
                const start = blockRefs.current[i]?.selectionStart ?? 0
                blockFocusRef.current[i + 1]?.blockFocus(start, start)
              }

              // Arrow Right / Left
              if (e.key === "ArrowRight" && isCaretLast) {
                blockFocusRef.current[i + 1]?.blockFocus(0)
              } else if (e.key === "ArrowLeft" && isCaretFirst) {
                blockFocusRef.current[i - 1]?.blockFocus(blocks[i - 1].content.length)
              }

              // Tab
              if (e.key === "Tab" && (block.type === "ul" || block.type === "p")) {
                e.preventDefault()
                // Shiftを押している場合、ネストを下げる
                const inverse = e.shiftKey
                const depth = inverse ? blocks[i].depth - 1 : blocks[i].depth + 1
                // 前行から2つ以上ネストを下げることはできない
                if (2 <= depth - blocks[i - 1].depth) {
                  return blocks
                }
                setBlocks((blocks) => {
                  const newBlocks = [...blocks]
                  if (blocks[i].depth === 1 && inverse) {
                    // 箇条書きを解除
                    newBlocks.splice(i, 1, { ...blocks[i], type: "p", depth: 0 })
                  } else {
                    // 箇条書きのネストを変更
                    newBlocks.splice(i, 1, {
                      ...blocks[i],
                      depth,
                    })
                  }
                  // TODO: 箇条書きの整合性チェック（ネストが開いた箇条書きが生成されてしまう）
                  return newBlocks
                })
              }
            }}
            onChange={(str: string) => {
              const changedBlocks = parseBlock(str, block)
              setBlocks((blocks) => {
                const _blocks = [...blocks]
                _blocks.splice(i, 1, ...changedBlocks)
                return _blocks
              })

              // フォーカスを移動する
              if (changedBlocks.length === 1) {
                if (block.type !== changedBlocks[0].type) {
                  // タイプが変更された場合に、キャレットの位置を合わせる
                  const start = blockRefs.current[i]?.selectionStart ?? 0
                  blockFocusRef.current[i]?.blockFocus(
                    start - blockTypes[changedBlocks[0].type].prefix.length,
                  )
                }
              } else if (1 < changedBlocks.length) {
                // ブロックが分割された時に、最後のブロックの最初にキャレットを移動する
                if (i === blocks.length - 1) {
                  setTimeout(
                    () => blockFocusRef.current[i + changedBlocks.length - 1]?.blockFocus(),
                    0,
                  )
                } else {
                  blockFocusRef.current[i + changedBlocks.length - 1]?.blockFocus(0)
                }
              }
            }}
          />
        ))}
      </div>
      <div className="fixed inset-x-0 bottom-0 w-[360px]">
        {selectMode ? "true" : "false"}
        <br />
        {JSON.stringify(blocks)}
      </div>
    </>
  )
}

export default Editor
