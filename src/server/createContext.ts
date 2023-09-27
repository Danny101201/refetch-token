import { NextRequest, NextResponse } from "next/server";
import { inferAsyncReturnType } from "@trpc/server";
import { CreateNextContextOptions } from "@trpc/server/adapters/next";
import { prisma } from "./utils/prisma";
import { deserializeUser } from "./middleware/deserializeUser";

export const createContext = (opt: CreateNextContextOptions) => {
  const { req, res } = opt
  return deserializeUser({ req, res })
}


export type Context = inferAsyncReturnType<typeof createContext>