export type Block = {
  content: string
  type: keyof typeof classes
  /**
   * 箇条書き等のネスト数
   */
  depth: number
}

export const classes = {
  h1: "text-3xl font-bold leading-[2em]",
  h2: "text-2xl font-bold leading-[2em]",
  h3: "text-xl font-bold leading-[2em]",
  p: "text-base ml-[calc((var(--data-depth))_*_24px)]",
  ul: "text-base pl-3 w-[calc(100%-(var(--data-depth))_*_24px)] ml-[calc((var(--data-depth)-1)_*_24px_+_12px)] before:ml-[calc(var(--data-depth)_*_24px_-_12px)] after:ml-[calc(var(--data-depth)_*_24px)] before:absolute before:left-0 before:top-[12px] before:h-[5px] before:w-[5px] before:-translate-x-1/2 before:-translate-y-1/2 before:rounded-full before:border before:border-gray-900 before:bg-gray-900 before:content-['']",
  // NOTE: 行頭記号の切り替え before:rounded-[calc(var(--data-depth-mod-3)_*_10px)]
}

export const modifiers = {
  h1: (v: string) => `# ${v}`,
  h2: (v: string) => `## ${v}`,
  h3: (v: string) => `### ${v}`,
  p: (v: string) => v,
  ul: (v: string) => `- ${v}`,
}

export const placeholders = {
  h1: "Heading 1",
  h2: "Heading 2",
  h3: "Heading 3",
  p: "Text",
  ul: "List Item",
}

export type BlockType = {
  className: string
  placeholder: {
    content: string
    showAlways: boolean
  }
  modifier: (v: string) => string
  prefix: string
  /**
   * 改行したときに、元のスタイルを引き継ぐかを表す。
   * - reset: Headingなどが該当し、Enterを押して改行した場合、新しい行はデフォルトスタイルとなる
   * - inherit: 箇条書きなどが該当し、Enterを押して改行した場合、新しい行は元のスタイルと同じになる
   */
  breakType: "reset" | "inherit"
  /**
   * キャレットが行の先頭にある時にBackSpaceを押した場合、trueの場合はまずスタイルがデフォルトに戻る。falseの場合は前のブロックと統合される。
   */
}

export const blockTypes: Record<string, BlockType> = {
  h1: {
    className: "text-3xl font-bold leading-[2em]",
    placeholder: { content: "Heading 1", showAlways: true },
    prefix: "# ",
    modifier: (v) => `# ${v}`,
    breakType: "reset",
  },
  h2: {
    className: "text-2xl font-bold leading-[2em]",
    placeholder: { content: "Heading 2", showAlways: true },
    prefix: "## ",
    modifier: (v) => `## ${v}`,
    breakType: "reset",
  },
  h3: {
    className: "text-xl font-bold leading-[2em]",
    placeholder: { content: "Heading 3", showAlways: true },
    prefix: "### ",
    modifier: (v) => `### ${v}`,
    breakType: "reset",
  },
  p: {
    className: "text-base",
    placeholder: { content: "Text", showAlways: false },
    prefix: "",
    modifier: (v) => v,
    breakType: "reset",
  },
  ul: {
    className:
      "pl-6 before:absolute before:left-3 before:top-1/2 before:h-[5px] before:w-[5px] before:-translate-x-1/2 before:-translate-y-1/2 before:rounded-full before:bg-gray-900 before:content-['']",
    placeholder: { content: "List Item", showAlways: false },
    prefix: "- ",
    modifier: (v) => `- ${v}`,
    breakType: "inherit",
  },
}

export const defaultBlock = {
  content: "",
  type: "p" as const,
  depth: 0,
}
