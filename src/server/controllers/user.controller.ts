import { Context } from "../createContext";
import { UpdateImgSchema } from "../schema/user.schema";

export const getMeHandler = async ({ ctx }: { ctx: Context }) => {
  const user = ctx.user
  return {
    status: 'success',
    data: {
      user
    }
  }
}
export const updateUserImageHandler = async ({ ctx, input }: { ctx: Context, input: UpdateImgSchema }) => {

  const { prisma, user } = ctx
  const { url } = input
  await prisma.user.update({
    where: {
      id: user?.id
    },
    data: {
      photo: url
    }
  })
  return {
    message: 'success update profile image'
  }
}