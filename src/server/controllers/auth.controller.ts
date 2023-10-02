import { TRPCError } from '@trpc/server';
import bcrypt from 'bcryptjs';
import { OptionsType } from 'cookies-next/lib/types';
import { getCookie, setCookie } from 'cookies-next';

import { Context } from '../createContext';
import { CreateUserSchema, createUserSchema, loginUserSchema, LoginUserSchema } from '../schema/user.schema';
import {
  createUser,
  findUniqueUser,
  findUser,
  signTokens,
} from '../services/user.service';

import { signJwt, verifyJwt } from '../utils/jwt';
import { prisma } from '../utils/prisma';
import { redisClient } from '../utils/connectRedis';
import { customConfig } from '../config/default';

export const cookieOptions: OptionsType = {
  // cookie 不能透過 js 修改
  httpOnly: true,
  // 只能透過 https 傳輸
  secure: process.env.NODE_ENV === 'production',
  // 提供跨域發送 cookie 的彈性
  sameSite: 'lax'
}

export const accessTokenCookieOptions: OptionsType = {
  ...cookieOptions,
  expires: new Date(Date.now() + customConfig.accessTokenExpiresIn * 60 * 1000)
}
export const refreshTokenCookieOptions: OptionsType = {
  ...cookieOptions,
  expires: new Date(Date.now() + customConfig.refreshTokenExpiresIn * 60 * 1000)
}

export const registerHandler = async ({ input }: {
  input: CreateUserSchema
}) => {
  const duplicateUser = await findUser({ email: input.email })
  if (duplicateUser) {
    throw new TRPCError({
      code: 'CONFLICT',
      message: 'Email has Already exists'
    })
  }
  const hashPassword = await bcrypt.hash(input.password, 12)
  const user = await createUser({
    name: input.name,
    email: input.email,
    photo: input.photo,
    hashPassword,
    provider: 'local'
  }, {
    id: true,
    name: true,
    email: true,
    photo: true
  })
  return {
    status: 'success',
    data: {
      user
    }
  }

}

export const loginHandler = async ({ input, ctx }: {
  input: LoginUserSchema,
  ctx: Context
}) => {
  const { req, res } = ctx
  const user = await findUser({ email: input.email })
  if (!user) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'user not found'
    })
  }
  const isValidatePassword = await bcrypt.compare(input.password, user.hashPassword as string,)
  if (!isValidatePassword) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Invalid password'
    })
  }
  const { access_token, refresh_token } = await signTokens(user)

  // setCookie('key', 'value'); // - client side
  // setCookie('key', 'value', { req, res }); // - server side

  setCookie('access_token', access_token, {
    req,
    res,
    ...accessTokenCookieOptions,
  })
  setCookie('refresh_token', refresh_token, {
    req,
    res,
    ...refreshTokenCookieOptions,
  })
  setCookie('logged_in', 'true', {
    req,
    res,
    ...accessTokenCookieOptions,
    httpOnly: false
  })
  return {
    status: 'success',
    access_token
  }
}

export const refreshAccessTokenHandler = async ({ ctx }: {
  ctx: Context
}) => {
  const { req, res } = ctx
  const refetch_token = getCookie('refresh_token', { req, res })
  let message = 'Could not refresh access token'
  if (!refetch_token) {
    throw new TRPCError({ code: 'FORBIDDEN', message })
  }
  const decoded = verifyJwt<{ sub: string }>(refetch_token, 'refreshTokenPublicKey')
  if (!decoded) {
    throw new TRPCError({ code: 'FORBIDDEN', message })
  }

  const session = await redisClient.get(decoded.sub)
  if (!session) {
    throw new TRPCError({ code: 'FORBIDDEN', message })
  }
  const user = await findUniqueUser({ id: JSON.parse(session).id })
  if (!user) {
    throw new TRPCError({ code: 'FORBIDDEN', message })
  }
  const { access_token, refresh_token } = await signTokens(user)
  setCookie('access_token', access_token, {
    req,
    res,
    ...accessTokenCookieOptions
  })
  setCookie('logged_in', 'true', {
    req,
    res,
    ...accessTokenCookieOptions,
    httpOnly: false
  })

  return {
    status: 'success',
    access_token
  }
}
const logout = async ({ ctx }: { ctx: Context }) => {
  const { req, res } = ctx
  setCookie('access_token', '', { req, res, maxAge: -1 })
  setCookie('refresh_token', '', { req, res, maxAge: -1 })
  setCookie('logged_in', '', { req, res, maxAge: -1 })
}

export const logoutHandler = async ({ ctx }: { ctx: Context }) => {
  const { user } = ctx
  await redisClient.del(String(user?.id))
  logout({ ctx })
  return { status: 'success' }
}