import React, { useRef, useState } from "react"
import classNames from "classnames"
import { Block, modifiers } from "../../../type/Editor"
import BlockComponent from "./Block"
import parseBlock from "../../../utils/parseBlock"
import { useSetEditorContext } from "./context"

export type EditorProps = {
  className?: string
}

const initBlock = {
  raw: "",
  content: "",
  type: "p" as const,
}

const Editor: React.VFC<EditorProps> = ({ className }) => {
  const [blocks, setBlocks] = useState<Block[]>([initBlock])
  const blockRefs = useRef<(HTMLTextAreaElement | null)[]>([])
  const setEditorContext = useSetEditorContext()

  return (
    <div
      className={classNames("rounded border border-slate-200 bg-white p-4 shadow-md", className)}
      onPointerDown={() => setEditorContext({ selectMode: true })}
      onPointerUp={() => setEditorContext({ selectMode: false })}
    >
      {blocks.map((block, i) => (
        <BlockComponent
          key={i}
          ref={(ref) => (blockRefs.current[i] = ref)}
          block={block}
          onKeyDown={(e) => {
            // BackSpace
            if (block.content.length === 0 && e.key === "Backspace") {
              e.preventDefault()
              setBlocks((blocks) => {
                const newBlocks = [...blocks]
                if (block.type === initBlock.type) {
                  // 消す
                  newBlocks.splice(i, 1)
                  blockRefs.current[i - 1]?.focus()
                } else {
                  // タイプをリセット
                  newBlocks.splice(i, 1, initBlock)
                }
                return newBlocks
              })
            }

            // Arrow
            if (e.key === "ArrowUp") {
              const start = blockRefs.current[i]?.selectionStart ?? 0
              console.log(start)
              blockRefs.current[i - 1]?.focus()
              setTimeout(() => blockRefs.current[i - 1]?.setSelectionRange(start, start), 0)
            } else if (e.key === "ArrowDown") {
              const start = blockRefs.current[i]?.selectionStart ?? 0
              blockRefs.current[i + 1]?.focus()
              setTimeout(() => blockRefs.current[i + 1]?.setSelectionRange(start, start), 0)
            }
          }}
          onChange={(str: string) => {
            const values = modifiers[block.type](str).split("\n")

            const changedBlocks = values.map(parseBlock)
            setBlocks((blocks) => {
              const newBlocks = [...blocks]
              newBlocks.splice(i, 1, ...changedBlocks)
              return newBlocks
            })

            // フォーカスを移動する
            if (1 < changedBlocks.length) {
              if (blocks.length === 1) {
                // なぜか遅延を入れないと反映されない
                setTimeout(() => blockRefs.current[i + changedBlocks.length - 1]?.focus(), 0)
              } else {
                blockRefs.current[i + changedBlocks.length - 1]?.focus()
                setTimeout(
                  () => blockRefs.current[i + changedBlocks.length - 1]?.setSelectionRange(0, 0),
                  0,
                )
              }
            }
          }}
        />
      ))}
    </div>
  )
}

export default Editor
