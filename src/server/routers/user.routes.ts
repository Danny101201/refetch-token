import { getMeHandler } from "../controllers/user.controller";
import { protectProcedure, router } from "../createRouter";

export const userRouter = router({
  getMe:
    protectProcedure
      .query(async ({ ctx }) => getMeHandler({ ctx }))
})