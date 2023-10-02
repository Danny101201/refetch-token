import React from 'react'
import { Spinner } from './Spinner'

export const FullScreenLoader = () => {
  return (
    <div className='fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-black/20'>
      <Spinner className='w-8 h-8' />
    </div>
  )
}

