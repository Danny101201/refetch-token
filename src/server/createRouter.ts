import { TRPCError, initTRPC } from "@trpc/server";
import { Context } from "./createContext";
import SuperJSON from "superjson";
import { ZodError } from "zod";

export const t = initTRPC.context<Context>().create({
  transformer: SuperJSON,
  // errorFormatter: (opts) => {
  //   const { shape, error } = opts
  //   return {
  //     ...shape,
  //     data: {
  //       ...shape.data,
  //       zodError:
  //         error.code === 'BAD_REQUEST' && error.cause instanceof ZodError
  //           ? error.cause.flatten()
  //           : null
  //     }
  //   }
  // }
})
const middleware = t.middleware
const isAuthed = middleware(({ next, ctx }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: 'You must be logged in to access this resource' })
  }
  return next()
})
export const publicProcedure = t.procedure
export const protectProcedure = t.procedure.use(isAuthed)
export const router = t.router
