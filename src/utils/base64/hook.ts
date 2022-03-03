import { useCallback, useEffect, useState } from "react"
import { debounce } from "throttle-debounce"
import { encodeBase64 } from "./encodeBase64"

const useBase64Encode = (obj: unknown[]) => {
  const [state, setState] = useState("")

  const func = useCallback(
    (obj: unknown[]) =>
      debounce(1000, (obj: unknown[]) => {
        const json = JSON.stringify(obj)
        const encoded = encodeBase64(json)
        setState(encoded)
      })(obj),
    [],
  )

  useEffect(() => {
    func(obj)
  }, [func, obj])

  return state
}

export default useBase64Encode
