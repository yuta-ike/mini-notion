import React, { useEffect, useImperativeHandle, useRef, useState } from "react"
import classNames from "classnames"
import { Block, blockTypes, classes } from "../../../configs/editor"
import { useEditorContextValue } from "./context"
import getCaretPos from "textarea-caret"

export type BlockFocus = (
  start?: number,
  end?: number,
  left?: number,
  options?: FocusOptions,
) => void

export type BlockProps = {
  block: Block
  onChange: (str: string) => void
  blockFocus: React.ForwardedRef<{ blockFocus: BlockFocus }>
  onKeyDown?: (
    event: React.KeyboardEvent<HTMLTextAreaElement>,
    caretPosY: { isFirst: boolean; isLast: boolean; left: number },
  ) => void
  className?: string
} & Omit<React.ComponentProps<"textarea">, "onChange" | "onKeyDown">

const BlockComponent = React.forwardRef<HTMLTextAreaElement | null, BlockProps>(
  function BlockComponent_Render(
    { block: { type, content, depth }, onChange, blockFocus, className, onKeyDown, ...porps },
    ref,
  ) {
    const { selectMode } = useEditorContextValue()
    const wrapperRef = useRef<HTMLDivElement | null>(null)
    const textareaRef = useRef<HTMLTextAreaElement | null>(null)
    const divRef = useRef<HTMLDivElement | null>(null)
    const [isDragging, setIsDragging] = useState(false)

    useImperativeHandle<HTMLTextAreaElement | null, HTMLTextAreaElement | null>(
      ref,
      () => textareaRef.current,
    )

    useImperativeHandle<{ blockFocus: BlockFocus }, { blockFocus: BlockFocus }>(blockFocus, () => ({
      blockFocus: (start?: number, end = start, left?: number, options?: FocusOptions) => {
        if (left != null) {
          setTimeout(() => {
            // TODO: キャッシュしたい
            if (divRef.current == null) {
              return
            }
            const dummy = document.createElement("div")
            dummy.classList.add(
              ..."absolute inset-0 w-full select-none resize-none whitespace-pre-wrap break-all".split(
                " ",
              ),
            )
            wrapperRef.current?.appendChild(dummy)
            let lineHeight: number | undefined
            let prevWidth: number = 0
            let formerLineCount: number = 0
            const widthList: number[] = []
            for (let i = 0; i < content.length; i++) {
              dummy.innerHTML = `${content.slice(
                0,
                content.length - 1 - i,
              )}<span id="measure">${content.slice(content.length - 1 - i)}</span>`

              const top = document.getElementById("measure")?.getBoundingClientRect().top
              const width = document.getElementById("measure")?.getBoundingClientRect()
                .width as number
              if (lineHeight == null && top != null) {
                lineHeight = top
              }

              if (lineHeight != null && top != null && lineHeight.toFixed(0) !== top.toFixed(0)) {
                formerLineCount = content.length - i
                break
              }
              widthList.push(width - prevWidth)
              prevWidth = width
            }

            widthList.reverse()
            widthList.push(0)

            wrapperRef.current?.removeChild?.(dummy)
            let sum = 0
            let startIndex: number | undefined

            for (let i = 0; i < widthList.length; i++) {
              if (left < sum) {
                if (i === 0) {
                  startIndex = 0
                } else if (sum - left < left - (sum - widthList[i - 1])) {
                  startIndex = i
                } else {
                  startIndex = i - 1
                }
                break
              }
              sum += widthList[i]
            }

            setIsFocused(true)
            textareaRef.current?.focus(options)
            textareaRef.current?.setSelectionRange(
              formerLineCount + (startIndex ?? content.length),
              formerLineCount + (startIndex ?? content.length),
            )
          }, 0)
        } else {
          setIsFocused(true)
          setTimeout(() => {
            textareaRef.current?.focus(options)
            if (start != null && end != null) {
              textareaRef.current?.setSelectionRange(start, end)
            }
          }, 0)
        }
      },
    }))

    const [isFocused, setIsFocused] = useState(true)

    useEffect(() => {
      setIsFocused(false)
    }, [])

    // キャレットの位置を取得
    const [caretOffset, setCaretOffset] = useState(textareaRef.current?.selectionStart ?? 0)
    useEffect(() => {
      const listener = (e: KeyboardEvent | PointerEvent) => {
        if ("key" in e && !(e.key === "ArrowUp" || e.key === "ArrowDown")) {
          return
        }

        setTimeout(() => {
          if (textareaRef.current == null) {
            return
          }
          const startIndex = textareaRef.current.selectionStart
          if (startIndex != null) {
            setCaretOffset(startIndex)
          }
        }, 0)
      }
      window.addEventListener("keydown", listener)
      window.addEventListener("pointerdown", listener)
      return () => {
        window.removeEventListener("keydown", listener)
        window.removeEventListener("pointerdown", listener)
      }
    }, [])

    useEffect(() => {
      const startIndex = textareaRef.current?.selectionStart
      if (startIndex != null) {
        setCaretOffset(startIndex)
      }
    }, [content])

    const [caretLine, setCaretLine] = useState<{ isFirst: boolean; isLast: boolean; left: number }>(
      {
        isFirst: true,
        isLast: true,
        left: 0,
      },
    )

    useEffect(() => {
      if (textareaRef.current == null) {
        return
      }
      const pos = getCaretPos(textareaRef.current, caretOffset)

      // NOTE: 一番大きいH1が12、一番小さいpが2行の時が27なので、15を閾値とすれば1行か複数行か判定できる
      const isFirstLine = pos.top < 15
      const isLastLine =
        Math.abs(textareaRef.current.getBoundingClientRect().height - (pos.top + pos.height)) < 15
      // TODO: ここも厳密に計算する必要あり
      if (isFirstLine && isLastLine) {
        setCaretLine({ isFirst: true, isLast: true, left: pos.left })
      } else if (isFirstLine) {
        setCaretLine({ isFirst: true, isLast: false, left: pos.left })
      } else if (isLastLine) {
        setCaretLine({ isFirst: false, isLast: true, left: pos.left })
      } else {
        setCaretLine({ isFirst: false, isLast: false, left: pos.left })
      }
    }, [caretOffset])

    return (
      <div className={classNames("relative flex min-h-[1em] pb-1", className)} ref={wrapperRef}>
        {isFocused && (
          <textarea
            rows={1}
            spellCheck={false}
            ref={textareaRef}
            className={classNames(
              "absolute inset-0 w-full select-none resize-none whitespace-pre-wrap break-all rounded-none bg-transparent caret-black placeholder:text-gray-300 focus:outline-none",
              classes[type],
            )}
            style={{ "--data-depth": depth, "--data-depth-mod-3": depth % 3 }}
            value={content}
            onChange={(e) => onChange(e.target.value)}
            onPointerDown={() => setIsDragging(true)}
            onPointerUp={() => setIsDragging(false)}
            onMouseLeave={() => {
              if (textareaRef.current == null || !isDragging) {
                return
              }

              const selectionStart = textareaRef.current.selectionStart
              const selectionEnd = textareaRef.current.selectionEnd

              setIsFocused(false)
              const selection = window.getSelection()
              selection?.removeAllRanges()
              setTimeout(() => {
                if (divRef.current?.firstChild == null) {
                  return
                }
                const range = document.createRange()
                const selection = window.getSelection()
                if (selectionStart === 0) {
                  // なんかこれで上手くいくぽい
                  range.setStartAfter(divRef.current.firstChild)
                } else {
                  range.setStart(divRef.current.firstChild, selectionStart)
                }
                range.setEnd(divRef.current.firstChild, selectionEnd)
                selection?.removeAllRanges()
                selection?.addRange(range)
                range.detach()
              }, 0)
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={(e) => onKeyDown?.(e, caretLine)}
            {...porps}
          />
        )}

        <div
          className={classNames(
            "w-full cursor-text whitespace-pre-wrap break-all after:text-gray-300 focus:outline-none",
            isFocused && "text-transparent",
            content.length === 0 &&
              "inset-y-0 left-0 after:absolute after:inset-y-0 after:left-0 after:block after:content-[attr(placeholder)]",
            classes[type],
          )}
          style={{ "--data-depth": depth, "--data-depth-mod-3": depth % 3 }}
          ref={divRef}
          placeholder={
            blockTypes[type].placeholder.content
            // blockTypes[type].placeholder.showAlways || isFocused
            //   ? blockTypes[type].placeholder.content
            //   : ""
          }
          contentEditable={!selectMode}
          suppressContentEditableWarning
          tabIndex={-1}
          onClick={() => {
            setIsFocused(true)
            const start = window.getSelection()?.anchorOffset
            const offset = window.getSelection()?.focusOffset
            setTimeout(() => {
              textareaRef.current?.focus()
              if (offset != null && start != null) {
                textareaRef.current?.setSelectionRange(start, offset)
              }
            }, 0)

            // キャレット位置を設定
            if (offset != null) {
              setCaretOffset(offset)
            }
          }}
          spellCheck={false}
        >
          <span className="sr-only whitespace-pre" aria-hidden>
            {"  ".repeat(depth) + blockTypes[type].prefix}
          </span>
          {content.length === 0 ? " " : content}
        </div>
      </div>
    )
  },
)

export default BlockComponent
