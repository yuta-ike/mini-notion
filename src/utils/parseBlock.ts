import { Block, blockTypes } from "../configs/editor"

const parseBlock = (str: string, parentBlock: Block): Block[] => {
  const blockTexts = str.split("\n")
  const shouldReset = blockTypes[parentBlock.type].breakType === "reset"

  // 空行の場合
  if (parentBlock.type !== "p" && 1 < blockTexts.length && str.replaceAll("\n", "").length === 0) {
    return [
      {
        type: "p" as const,
        content: "",
        depth: 0,
      },
    ]
  }

  return blockTexts.map((str, i) => _parseBlock(str, parentBlock, i !== 0 && shouldReset))
}

export default parseBlock

const _parseBlock = (str: string, block: Block, reset: boolean) => {
  // 見出し
  {
    const res = str.match(/(?<hash>#{1,3})\s(?<content>.*)/)
    if (res?.groups != null) {
      return {
        type: `h${res.groups.hash.length}` as Block["type"],
        content: res.groups.content,
        depth: 0,
      }
    }
  }

  // 箇条書き
  {
    const res = str.match(/[\-\*\+]\s(?<content>.*)/)
    if (res?.groups != null) {
      return {
        type: "ul" as const,
        content: res.groups.content,
        depth: 1,
      }
    }
  }

  if (reset) {
    return {
      type: "p" as const,
      content: str,
      depth: block.depth,
    }
  } else {
    return {
      type: block.type,
      content: str,
      depth: block.depth,
    }
  }
}
