import { prisma } from '../src/server/utils/prisma'
const main = async () => {
  try {

    const user = await prisma.user.create({
      data: {
        name: 'Danny',
        email: 'hiunji65@gmasil.com',
      }
    })
    console.log(user)
  } catch (e) {
    console.error(e)
  }
}

