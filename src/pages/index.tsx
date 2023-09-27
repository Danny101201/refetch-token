import React from 'react'
import { api } from '~/utils/trpc'
import { getCookie, setCookie } from 'cookies-next';
function Page() {
  const { data } = api.getHello.useQuery()

  const { mutateAsync: getToken } = api.signToken.useMutation({
    onSuccess(data, variables, context) {
      console.log(data)
    },
  })
  const { mutateAsync: register } = api.auth.registerUser.useMutation({})
  return (
    <div>
      <button onClick={() => getToken({ name: 'Danny' })}>getToken</button>
      {data?.message}
      <button onClick={() => register({ name: 'Danny' })}>register</button>
    </div>
  )
}

export default Page