import { NextPage } from "next"
import { useEffect } from "react"
import parseMarkdown from "../utils/parseMarkdown"
import Editor from "../view/component/Editor"

const Index: NextPage = () => {
  useEffect(() => {
    parseMarkdown()
  }, [])
  return (
    <div className="h-full p-8">
      <article className="mx-auto w-[800px] max-w-[90%] overflow-scroll">
        <Editor className="min-h-[80vh]" />
      </article>
    </div>
  )
}

export default Index
