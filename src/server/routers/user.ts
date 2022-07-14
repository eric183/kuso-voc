import { createRouter } from "../createRouter";
// import { prisma } from "~/server/prisma";
import { z } from "zod";
import { prismaClient } from "../prisma";
import { Prisma } from "@prisma/client";

const defaultCommentSelect = Prisma.validator<Prisma.UserSelect>()({
  name: true,
  email: true,
  isAdmin: true,
  isActive: true,
  // words: true,
});

export const userRouter = createRouter().query("get", {
  input: z
    .object({
      email: z.string().email(),
    })
    .nullish(),
  async resolve({ input }) {
    return await prismaClient.user.findUnique({
      where: {
        email: input?.email,
      },
      select: defaultCommentSelect,
    });
  },
});
