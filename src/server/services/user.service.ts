import { Prisma, User } from "@prisma/client"
import { redisClient } from "../utils/connectRedis"
import { json } from "stream/consumers"
import { customConfig } from "../config/default"
import { signJwt } from "../utils/jwt"

export const createUser = async (input: Prisma.UserCreateInput) => {
  return prisma?.user.create({ data: input })
}

export const findUser = async (
  where: Prisma.UserWhereInput,
  select?: Prisma.UserSelect
) => {
  return prisma?.user.findFirst({
    where,
    select
  })
}
export const findUniqueUser = async (
  where: Prisma.UserWhereUniqueInput,
  select?: Prisma.UserSelect
) => {
  return prisma?.user.findUnique({
    where,
    select
  })
}

export const updateUser = async (
  where: Prisma.UserWhereUniqueInput,
  data: Prisma.UserUpdateInput,
  select?: Prisma.UserSelect
) => {
  return prisma?.user.update({
    where,
    data,
    select
  })
}

export const deleteUser = async (
  where: Prisma.UserWhereUniqueInput,
) => {
  return prisma?.user.delete({
    where,
  })
}

export const signTokens = async (
  user: User
) => {
  // Create session
  redisClient.set(`${user.id}`, JSON.stringify(user), {
    EX: customConfig.redisCacheExpiresIn * 60
  })

  // create accessToken and refreshToken
  const access_token = signJwt({ sub: user.id }, 'accessTokenPrivateKey', {
    expiresIn: customConfig.accessTokenExpiresIn * 60
  })
  const refresh_token = signJwt({ sub: user.id }, 'refreshTokenPrivateKey', {
    expiresIn: customConfig.refreshTokenExpiresIn * 60
  })
  return { refresh_token, access_token }
}