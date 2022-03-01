import React from "react"
import EditorContextProvider from "./context"
import Editor_Inner, { EditorProps } from "./Editor"

const Editor: React.VFC<EditorProps> = (props) => {
  return (
    <EditorContextProvider>
      <Editor_Inner {...props} />
    </EditorContextProvider>
  )
}

export default Editor
