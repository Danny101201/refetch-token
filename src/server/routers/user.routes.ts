import { z } from "zod";
import { getMeHandler, updateUserImageHandler } from "../controllers/user.controller";
import { protectProcedure, publicProcedure, router } from "../createRouter";
import { updateImgSchema } from "../schema/user.schema";

export const userRouter = router({
  getMe:
    protectProcedure
      .query(async ({ ctx }) => getMeHandler({ ctx })),
  setImage:
    protectProcedure
      .input(updateImgSchema)
      .mutation(async ({ ctx, input }) => updateUserImageHandler({ ctx, input }))
})