import { useRouter } from "next/router"
import { useEffect } from "react"

const useSyncPath = (code: string) => {
  const router = useRouter()
  useEffect(() => {
    router.push({ pathname: router.pathname, query: { code } }, undefined, { shallow: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code])
}

export default useSyncPath
