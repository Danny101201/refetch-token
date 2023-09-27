import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string({ required_error: 'name is required' }),
  email: z.string({ required_error: 'email is required' }).email('Invalidate email'),
  photo: z.string({ required_error: 'photo is required' }),
  password: z.string({ required_error: 'photo is required' })
    .min(8, { message: 'password must more than 8 characters' })
    .max(32, { message: 'password must less than 32 characters' }),
  passwordConfirm: z.string({ required_error: 'Please confirm your password' })
}).refine(({ password, passwordConfirm }) => password == passwordConfirm, { path: ['passwordConfirm'], message: 'Passwords do not match' })
export type CreateUserSchema = z.infer<typeof createUserSchema>

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
