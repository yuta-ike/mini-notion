import { Block } from "../type/Editor"

const parseBlock = (str: string): Block => {
  {
    // 見出し
    const res = str.match(/(?<hash>#{1,3})\s(?<content>.*)/)
    if (res?.groups != null) {
      return {
        type: `h${res.groups.hash.length}` as Block["type"],
        raw: str,
        content: res.groups.content,
      }
    }
  }

  return { type: "p", raw: str, content: str }
}

export default parseBlock
