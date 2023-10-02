import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import React, { PropsWithChildren } from 'react'
import { ToastContainer } from 'react-toastify'
import { Header } from './Header'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export const queryClient = new QueryClient({})
interface ProviderProps extends PropsWithChildren { }
export const Provider = ({ children }: ProviderProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <Header />
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
      <ToastContainer />
    </QueryClientProvider>
  )
}
