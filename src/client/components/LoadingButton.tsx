import React, { PropsWithChildren } from 'react'
import { Spinner } from './Spinner';
interface LoadingButtonProps extends PropsWithChildren {
  loading: boolean;
  btnColor?: string;
  textColor?: string;
}
export const LoadingButton = ({ loading, btnColor, textColor, children }: LoadingButtonProps) => {
  return (
    <button
      type='submit'
      className={`w-full py-3 font-semibold ${btnColor} rounded-lg outline-none border-none flex justify-center ${loading ? 'bg-[#ccc]' : ''}`}
    >
      {loading ? (
        <div className='flex items-center gap-3'>
          <Spinner />
          <span className='text-slate-500 inline-block'>Loading...</span>
        </div>
      ) : (
        <span className={`${textColor}`}>{children}</span>
      )}
    </button>
  )
}

