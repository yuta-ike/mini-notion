import { GetServerSideProps, NextPage } from "next"
import { useMemo } from "react"
import Editor from "../view/component/Editor"
import { decodeBase64 } from "../utils/base64/encodeBase64"
import { parse as queryParse } from "query-string"

const defaultInitBlocks = [
  {
    type: "h1" as const,
    content: "",
    depth: 0,
  },
]

export type IndexProps = {
  code: string
}

const Index: NextPage<IndexProps> = ({ code }) => {
  const initBlocks = useMemo(() => {
    if (code == null) {
      return defaultInitBlocks
    }
    try {
      return JSON.parse(code)
    } catch {
      return defaultInitBlocks
    }
  }, [code])

  return (
    <div className="h-full p-8">
      <article className="mx-auto w-[800px] max-w-[90%] overflow-scroll">
        <Editor className="min-h-[80vh]" initBlocks={initBlocks} />
      </article>
    </div>
  )
}

export default Index

export const getServerSideProps: GetServerSideProps<IndexProps> = async (res) => {
  const queries = res.resolvedUrl.split("?")
  const code = queryParse(queries[queries.length - 1]).code
  if (code != null && typeof code === "string") {
    // URLからコードの読み込み
    const decoded = decodeBase64(code)
    try {
      return {
        props: {
          code: decoded,
        },
      }
    } catch (e) {
      return {
        props: {
          code: JSON.stringify(defaultInitBlocks),
        },
      }
    }
  }
  return {
    props: {
      code: JSON.stringify(defaultInitBlocks),
    },
  }
}
