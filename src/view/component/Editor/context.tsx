import React, { useContext, useMemo, useState } from "react"

export type EditorContext = {
  selectMode: boolean
}

export type EditorContextProviderValue = readonly [
  EditorContext,
  React.Dispatch<
    React.SetStateAction<{
      selectMode: boolean
    }>
  >,
]

const EditorContext = React.createContext<EditorContextProviderValue | null>(null)

export type EditorContextProviderProps = {
  children: React.ReactNode
}
const EditorContextProvider: React.VFC<EditorContextProviderProps> = ({ children }) => {
  const [editorContext, setEditorContext] = useState({ selectMode: false })
  const value = useMemo(() => [editorContext, setEditorContext] as const, [editorContext])
  return <EditorContext.Provider value={value}>{children}</EditorContext.Provider>
}

export default EditorContextProvider

export const useEditorContext = () => {
  const ret = useContext(EditorContext)
  if (ret == null) {
    throw new Error("cannot use useEditorContext outside of `EditorContextProvider`.")
  }
  return ret
}
export const useEditorContextValue = () => useEditorContext()[0]
export const useSetEditorContext = () => useEditorContext()[1]
