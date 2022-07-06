import { createRouter } from "../createRouter";
import { prisma } from "~/server/prisma";
import { z } from "zod";

export const userInfoRouter = createRouter().query("get", {
  input: z
    .object({
      email: z.string().email(),
    })
    .nullish(),

  async resolve({ input }) {
    return await prisma.user.findUnique({
      where: {
        email: input?.email,
      },
    });
  },
});
