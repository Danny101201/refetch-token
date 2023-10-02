import React, { useMemo } from 'react'
import { QueryClient } from 'react-query'
import { useStore } from '../store'
import { api } from '~/utils/trpc'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import { Spinner } from './Spinner'
import { FullScreenLoader } from './FullScreenLoader'

export const Header = () => {
  const apiContext = api.useContext()
  const { access_token, pageLoading, setAccessToken, deleteAccessToken } = useStore()
  const isAuth = useMemo(() => !!access_token, [access_token])
  const router = useRouter()

  const { mutateAsync: logout } = api.auth.logoutUser.useMutation({
    onSuccess: () => {
      apiContext.invalidate()
      router.replace('/login')
      setAccessToken('')
      toast.success('success logout')
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
  const handleLogout = async () => {
    await logout()
    deleteAccessToken()
  }
  return (
    <>
      <header className='bg-white h-20'>
        <nav className='h-full flex justify-between items-center container'>
          <div>
            <Link href={'/'} className='text-ct-dark-600'>token demo</Link>
          </div>
          <ul className='flex items-center gap-4'>
            <li>
              <Link href={'/'} className='text-ct-dark-600'>home</Link>
            </li>
            {!isAuth ? (
              <>
                <li>
                  <Link href={'/register'} className='text-ct-dark-600'>SignUp</Link>
                </li>
                <li>
                  <Link href={'/login'} className='text-ct-dark-600'>Login</Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link href={'/profile'} className='text-ct-dark-600'>Profile</Link>
                </li>
                <li className="cursor-pointer" onClick={handleLogout}>
                  Logout
                </li>
              </>
            )}
          </ul>
        </nav>
      </header>
      {pageLoading && (
        <FullScreenLoader />
      )}

    </>
  )
}

