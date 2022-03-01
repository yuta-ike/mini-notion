import MarkdownIt from "markdown-it"

const md = new MarkdownIt()

const parseMarkdown = () => {
  console.log(md.render("# hello"))
}

export default parseMarkdown
