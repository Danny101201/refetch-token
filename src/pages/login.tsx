import Link from 'next/link'
import React from 'react'
import { FileUpload } from '~/client/components/FileUpload'
import { FormInput } from '~/client/components/FormInput'
import { LoadingButton } from '~/client/components/LoadingButton'
import register from './register'
import { useForm } from 'react-hook-form'
import { loginUserSchema, LoginUserSchema } from '~/server/schema/user.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { api } from '~/utils/trpc'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'
import { useStore } from '~/client/store'

function LoginPage() {
  const { setAccessToken, access_token } = useStore()
  const router = useRouter()
  const { register, handleSubmit, formState: { errors } } = useForm<LoginUserSchema>({
    resolver: zodResolver(loginUserSchema),
    mode: 'onChange'
  })
  const { mutateAsync: userLogin, isLoading } = api.auth.loginUser.useMutation({
    onSuccess: (data) => {
      toast.success('success login ')
      setAccessToken(data.access_token)
      router.push('/profile')
    },
    onError: (e) => {
      toast.error(e.message)
    }
  })
  const onSubmitHandler = async (data: LoginUserSchema) => {
    userLogin(data)
  }
  return (
    <section className="py-8 bg-ct-blue-600 min-h-screen grid place-items-center">
      <div className="w-full">
        <h1 className="text-4xl xl:text-6xl text-center font-[600] text-ct-yellow-600 mb-4">
          Welcome Back
        </h1>
        <h2 className="text-lg text-center mb-4 text-ct-dark-200">
          Login to have access
        </h2>
        <form
          onSubmit={handleSubmit(onSubmitHandler)}
          className="max-w-md w-full mx-auto overflow-hidden shadow-lg bg-ct-dark-200 rounded-2xl p-8 space-y-5"
        >
          <FormInput
            register={register}
            error={errors.email}
            label="email"
            name="email"
          />
          <FormInput
            register={register}
            error={errors.password}
            label="password"
            name="password"
          />
          <LoadingButton loading={isLoading} textColor="text-ct-blue-600">
            Login
          </LoadingButton>
          <span className="block">
            Need an account?{" "}
            <Link href="/register" className="text-ct-blue-600">
              Sign Up Here
            </Link>
          </span>

        </form>
      </div>
    </section>
  )
}

export default LoginPage