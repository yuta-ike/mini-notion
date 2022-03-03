import useBase64Encode from "../../../utils/base64/hook"
import useSyncPath from "../../../utils/useSyncPath"

const useSyncCodeToPath = (blocks: unknown[]) => {
  const encoded = useBase64Encode(blocks)
  useSyncPath(encoded)
}

export default useSyncCodeToPath
