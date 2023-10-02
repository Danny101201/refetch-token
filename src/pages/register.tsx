import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { ChangeEvent, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { FileUpload } from '~/client/components/FileUpload'
import { FormInput } from '~/client/components/FormInput'
import { LoadingButton } from '~/client/components/LoadingButton'
import { useStore } from '~/client/store'
import { CreateUserFormSchema, createUserFormSchema } from '~/server/schema/user.schema'
import { api } from '~/utils/trpc'

function HomePage() {
  const router = useRouter()
  const { mutateAsync: registerUser, isLoading } = api.auth.registerUser.useMutation({
    onSuccess: () => {
      toast.success('success register user')
      router.push('/login')
    },
    onError: (e) => {
      toast.error(e.message)
    }
  })
  const [avatar, setAvatar] = useState<string>()
  const { setUPloadImage } = useStore()
  const { register, handleSubmit, reset, formState: { errors }, getValues, watch } = useForm<CreateUserFormSchema>({
    resolver: zodResolver(createUserFormSchema),
    mode: 'onChange'
  })
  const onSubmitHandler = async (data: CreateUserFormSchema) => {
    const { photo } = data
    const url = await uploadImageToCloudinary(photo)
    registerUser({
      name: data.name,
      password: data.password,
      email: data.email,
      photo: url || ''
    })
  }

  const uploadImageToCloudinary = async (image: ((string | false | File) & (string | false | File | undefined)) | null) => {
    if (!image || typeof image === 'string') return
    let formdata = new FormData()
    formdata.append("file", image);
    formdata.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);
    formdata.append("public_id", image.name);
    formdata.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_APIKEY);
    formdata.append("tags", 'profile');
    formdata.append("folder", getValues('name'));
    setUPloadImage(true)
    const result: UploadImageApiResponse = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_NAME}/image/upload`, {
      method: 'POST',
      body: formdata,
      redirect: 'follow'
    })
      .then(response => response.json())
      .catch(error => console.log('error', error))
      .finally(() => {
        setUPloadImage(false)
      })
    return result.secure_url

  }

  const handleRegisterProfile = async (e: ChangeEvent<HTMLInputElement>) => {
    await register('photo').onChange(e)
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      if (!reader.result) return
      setAvatar(reader.result?.toString())
    }
  }
  return (
    <section className="py-8 bg-ct-blue-600 min-h-screen grid place-items-center">
      <div className="w-full">
        <h1 className="text-4xl xl:text-6xl text-center font-[600] text-ct-yellow-600 mb-4">
          Welcome
        </h1>
        <h2 className="text-lg text-center mb-4 text-ct-dark-200">
          Sign Up To Get Started!
        </h2>
        <form
          onSubmit={handleSubmit(onSubmitHandler)}
          className="max-w-md w-full mx-auto overflow-hidden shadow-lg bg-ct-dark-200 rounded-2xl p-8 space-y-5"
        >
          <FormInput
            register={register}
            error={errors.name}
            label="Full Name"
            name="name"
          />
          <FormInput
            register={register}
            error={errors.email}
            label='email'
            name='email'
          />
          <FileUpload
            register={register}
            name='photo'
            error={errors.photo}
            label='profile'
            onChange={handleRegisterProfile}
          />
          {(avatar && !errors.photo) && (
            <div className='w-[100px] h-[100px] rounded-xl overflow-hidden relative'>
              <img src={avatar} alt="" className='object-cover w-full h-full ' />
            </div>
          )}

          <FormInput
            register={register}
            error={errors.password}
            label='password'
            name='password'
          />
          <FormInput
            register={register}
            error={errors.passwordConfirm}
            label='confirm password'
            name='passwordConfirm'
          />


          <span className="block">
            Already have an account?{" "}
            <Link href="/login" className="text-ct-blue-600">
              Login Here
            </Link>
          </span>
          <LoadingButton loading={isLoading} textColor="text-ct-blue-600">
            Sign Up
          </LoadingButton>
        </form>
      </div>
    </section>
  )
}

export default HomePage