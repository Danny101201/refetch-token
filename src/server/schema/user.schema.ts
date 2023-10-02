import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string({ required_error: 'name is required' }),
  email: z.string({ required_error: 'email is required' }).email('Invalidate email'),
  password: z.string({ required_error: 'password is required' })
    .min(8, { message: 'password must more than 8 characters' })
    .max(32, { message: 'password must less than 32 characters' }),
  photo: z.string({ required_error: 'profile is  require' })
})
export type CreateUserSchema = z.infer<typeof createUserSchema>
export const createUserFormSchema = z.object({
  name: z.string({ required_error: 'name is required' }),
  email: z.string({ required_error: 'email is required' }).email('Invalidate email'),
  photo: z.custom<FileList>()
    .transform(file => file?.length > 0 && file.item(0))
    .refine(file => !!file, {
      message: '請選擇上傳圖片'
    })
    .refine(file => !file || file.size <= 10 * 1204 * 1024, {
      message: '圖片上傳上限是 10 MB'
    })
    .refine(file => !file || file.type.startsWith('image'), {
      message: '只能上傳圖片'
    }),
  password: z.string({ required_error: 'password is required' })
    .min(8, { message: 'password must more than 8 characters' })
    .max(32, { message: 'password must less than 32 characters' }),
  passwordConfirm: z.string({ required_error: 'Please confirm your password' })
}).refine(({ password, passwordConfirm }) => password === passwordConfirm, { path: ['passwordConfirm'], message: 'Passwords do not match' })

export type CreateUserFormSchema = z.infer<typeof createUserFormSchema>

export const loginUserSchema = z.object({
  email: z.string({ required_error: 'Email is required' }).email(
    'Invalid email'
  ),
  password: z.string({ required_error: 'Password is required' }).min(
    8,
    'password must more than 8 characters'
  ),
});

export type LoginUserSchema = z.infer<typeof loginUserSchema>
export const updateImgSchema = z.object({
  url: z.string({ required_error: 'url is required' })
});

export type UpdateImgSchema = z.infer<typeof updateImgSchema>


export const uploadFormSchema = z.object({
  photo:
    z.custom<FileList>()
      .transform(file => file?.length > 0 && file.item(0))
      .refine(file => !!file, {
        message: '請選擇上傳圖片'
      })
      .refine(file => !file || file.size <= 10 * 1204 * 1024, {
        message: '圖片上傳上限是 10 MB'
      })
      .refine(file => !file || file.type.startsWith('image'), {
        message: '只能上傳圖片'
      })
})

export type UploadFormSchema = z.infer<typeof uploadFormSchema>

