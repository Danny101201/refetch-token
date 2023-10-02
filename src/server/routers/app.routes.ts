import { z } from "zod";
import { router, publicProcedure, protectProcedure } from "../createRouter";
import { redisClient } from "../utils/connectRedis";
import { signJwt, verifyJwt } from "../utils/jwt";
import { authRouter } from "./auth.routes";
import { userRouter } from "./user.routes";
export const appRouter = router({
  auth: authRouter,
  user: userRouter,
  getHello: protectProcedure
    .query(async ({ ctx }) => {
      const message = await redisClient.get('trpc')
      return { message, ctx: ctx.user }
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