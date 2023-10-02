import { useRouter } from "next/router"
import { useEffect } from "react"
import { useStore } from "~/client/store"
import { api } from "~/utils/trpc"

export const useRefreshToken = () => {
  const router = useRouter()
  const { setPageLoading } = useStore()
  const { data, isLoading, isError } = api.auth.refreshAccessToken.useQuery(undefined, {
    // refetchOnWindowFocus: false,
    // refetchOnMount: false,
    trpc: {
      context: {
        skipBatch: true
      }
    }
  })

  useEffect(() => {
    setPageLoading(isLoading)
  }, [isLoading])
  useEffect(() => {
    if (!isError) return
    router.push('/login')
  }, [isError])

}