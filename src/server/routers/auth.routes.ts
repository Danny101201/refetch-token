import { registerHandler, loginHandler, logoutHandler, refreshAccessTokenHandler } from "../controllers/auth.controller";
import { router, publicProcedure, protectProcedure } from "../createRouter";
import { createUserSchema, loginUserSchema } from "../schema/user.schema";

export const authRouter = router({
  registerUser:
    publicProcedure
      .input(createUserSchema)
      .mutation(async ({ input }) => {
        console.log(input)
      }),
  // .mutation(async ({ input }) => registerHandler({ input })),
  loginUser:
    publicProcedure
      .input(loginUserSchema)
      .mutation(async ({ ctx, input }) => loginHandler({ input, ctx })),
  logoutUser:
    protectProcedure
      .mutation(async ({ ctx }) => logoutHandler({ ctx })),
  refreshAccessToken:
    protectProcedure
      .query(async ({ ctx }) => refreshAccessTokenHandler({ ctx }))

})