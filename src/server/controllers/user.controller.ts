import { Context } from "../createContext";

export const getMeHandler = async ({ ctx }: { ctx: Context }) => {
  const user = ctx.user
  return {
    status: 'success',
    data: {
      user
    }
  }
}