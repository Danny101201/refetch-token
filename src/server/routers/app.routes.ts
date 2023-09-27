import { z } from "zod";
import { router, publicProcedure } from "../createRouter";
import { redisClient } from "../utils/connectRedis";
import { connectDB } from "../utils/prisma";
import { signJwt, verifyJwt } from "../utils/jwt";
import jwt from "jsonwebtoken";
import { customConfig } from "../config/default";
import { authRouter } from "./auth.routes";
import { userRouter } from "./user.routes";
export const appRouter = router({
  auth: authRouter,
  user: userRouter,
  getHello: publicProcedure
    .query(async () => {
      const message = await redisClient.get('trpc')
      return { message }
    }),
  signToken:
    publicProcedure
      .input(z.object({ name: z.string() }))
      .mutation(async ({ input }) => {
        const token = signJwt(input, 'accessTokenPrivateKey')
        const result = verifyJwt(token, 'accessTokenPublicKey')
        return token
      })
})



export type AppRouter = typeof appRouter