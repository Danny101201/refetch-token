import { CreateNextContextOptions } from "@trpc/server/adapters/next"
import { signJwt, verifyJwt } from "../utils/jwt"
import { redisClient } from "../utils/connectRedis"
import { findUniqueUser } from "../services/user.service"
import { TRPCError } from "@trpc/server"
import { prisma } from '../utils/prisma'
export const deserializeUser = async (
  opt: CreateNextContextOptions
) => {
  try {

    const { req, res } = opt
    let access_token
    if (req.headers.authorization) {
      access_token = req.headers.authorization
    }
    const notAuthenticated = {
      req,
      res,
      user: null,
      prisma
    };
    if (!access_token) return notAuthenticated
    const decode = verifyJwt<{ sub: string }>(
      access_token.includes('Bearer')
        ? access_token.substring(7)
        : access_token,
      'accessTokenPublicKey'
    )
    if (!decode) return notAuthenticated
    const session = await redisClient.get(decode.sub)
    if (!session) return notAuthenticated
    const user = await findUniqueUser({ id: JSON.parse(session).id })
    if (!user) return notAuthenticated
    return {
      req,
      res,
      prisma,
      user: { ...user, id: user.id }
    }
  } catch (e: any) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: e.message
    })
  }
}