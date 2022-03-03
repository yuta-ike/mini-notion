import React, { useCallback, useImperativeHandle, useRef } from "react"
import classNames from "classnames"
import { Block, classes, placeholders } from "../../../type/editor"
import { useEditorContextValue } from "./context"

export type BlockProps = {
  block: Block
  onChange: (str: string) => void
  className?: string
} & Omit<React.ComponentProps<"textarea">, "onChange">

const BlockComponent = React.forwardRef<HTMLTextAreaElement | null, BlockProps>(
  function BlockComponent_Render({ block: { type, content }, onChange, className, ...porps }, ref) {
    const { selectMode } = useEditorContextValue()
    const textareaRef = useRef<HTMLTextAreaElement | null>(null)

    useImperativeHandle<HTMLTextAreaElement | null, HTMLTextAreaElement | null>(
      ref,
      () => textareaRef.current,
    )

    return (
      <div className={classNames("relative min-h-[1em]", className)}>
        <textarea
          rows={1}
          ref={textareaRef}
          className={classNames(
            "absolute inset-0 w-full resize-none rounded-none bg-transparent caret-black focus:outline-none",
            "text-transparent",
            classes[type],
          )}
          placeholder={placeholders[type]}
          value={content}
          onChange={(e) => onChange(e.target.value)}
          {...porps}
        />
        <div
          className={classNames(
            "cursor-text whitespace-pre",
            selectMode ? "" : "text-red-400",
            classes[type],
          )}
        >
          {0 < content.length ? (
            content
          ) : (
            <span aria-hidden className="pointer-events-none select-none">
              {" "}
            </span>
          )}
        </div>
      </div>
    )
  },
)

export default BlockComponent
