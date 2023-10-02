import React, { ChangeEvent, useEffect, useMemo, useState } from 'react'
import { api } from '~/utils/trpc'
import { z } from 'zod';
import { useStore } from '~/client/store';
import { FileUpload } from '~/client/components/FileUpload';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { uploadFormSchema } from '~/server/schema/user.schema';
import { toast } from 'react-toastify';
import { useRefreshToken } from '~/hook/useRefetchToken';
function ProfilePage() {
  useRefreshToken()
  const apiContext = api.useContext()
  const { mutateAsync: setProfileImageUrl } = api.user.setImage.useMutation({
    onSuccess: () => {
      apiContext.user.getMe.invalidate()
      toast.success('success update user profile')
    }
  })

  const { data } = api.user.getMe.useQuery(undefined, {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    trpc: {
      context: {
        skipBatch: true
      }
    }
  })
  const user = useMemo(() => data?.data.user, [data])
  const { setPageLoading, setAccessToken, access_token } = useStore()
  const uploadImageToCloudinary = async (e: ChangeEvent<HTMLInputElement>) => {
    const image = e.target.files?.[0]
    if (!image) return
    const validateResult = uploadFormSchema.safeParse({ photo: e.target.files })
    if (!validateResult.success) return
    let formdata = new FormData()
    formdata.append("file", image);
    formdata.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);
    formdata.append("public_id", image.name);
    formdata.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_APIKEY);
    formdata.append("tags", 'profile');
    formdata.append("folder", user?.name as string);
    setPageLoading(true)
    const result: UploadImageApiResponse = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_NAME}/image/upload`, {
      method: 'POST',
      body: formdata,
      redirect: 'follow'
    })
      .then(response => response.json())
      .catch(error => console.log('error', error))
      .finally(() => {
        setPageLoading(false)
      })
    setProfileImageUrl({ url: result.secure_url ?? 'default.png' })
  }

  return (
    <>
      <section className="bg-ct-blue-600 min-h-screen pt-20">
        <div className="max-w-4xl mx-auto bg-ct-dark-100 rounded-md h-min-[20rem] flex justify-center items-center gap-4 p-4">
          <div className='flex-1 flex flex-col items-center justify-center gap-4'>
            <div className=' w-[200px] h-[200px] rounded-full overflow-hidden relative bg-red-500/20'>
              <img className='object-cover w-full h-full ' src={user?.photo || 'default.png'} />
            </div>

            <div>
              <label htmlFor='upload' className='cursor-pointer text-sm mb-2 text-slate-500 hover:text-white mr-4 py-2 px-4 rounded-full border-0 text-sm font-semibold bg-violet-200 text-violet-700 hover:bg-violet-400'>
                edit
              </label>
              <input
                id="upload"
                type="file"
                className='hidden'
                onChange={uploadImageToCloudinary}
                accept='image/*'
                multiple={false}
              />

            </div>
          </div>

          <div className='flex-1'>
            <p className="text-5xl font-semibold">Profile Page</p>
            <div className="mt-8">
              <p className="mb-4">ID: {user?.id}</p>
              <p className="mb-4">Name: {user?.name}</p>
              <p className="mb-4">Email: {user?.email}</p>
              <p className="mb-4">Role: {user?.role}</p>
            </div>
          </div>

        </div>
      </section>

    </>
  )
}

export default ProfilePage
