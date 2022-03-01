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
      <article className="max-w-90% mx-auto h-full w-[800px]">
        <Editor className="h-full" />
      </article>
    </div>
  )
}

export default Index
