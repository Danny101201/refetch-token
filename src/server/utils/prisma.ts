import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined
}

export const prisma = global.prisma || new PrismaClient()

if (process.env.NODE_ENV == 'development') global.prisma = prisma

export const connectDB = async () => {
  try {
    await prisma.$connect()
    console.log('? Database connected successfully');
  } catch (e: any) {
    console.error(e.message)
    await prisma.$disconnect()
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}