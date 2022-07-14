/**
 *
 * This is an example router, you can delete this file and then update `../pages/api/trpc/[trpc].tsx`
 */
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { createRouter } from "~/server/createRouter";
import { prismaClient } from "~/server/prisma";

/**
 * Default selector for comment.
 * It's important to always explicitly say which fields you want to return in order to not leak extra information
 * @see https://github.com/prisma/prisma/issues/9353
 */
// const defaultCommentSelect = Prisma.validator<Prisma.CommentSelect>()({
//   id: true,
//   postId: true,
//   name: true,
//   text: true,
// });

export const helloRouter = createRouter().query("all", {
  input: z
    .object({
      text: z.string().nullish(),
    })
    .nullish(),
  resolve({ input }) {
    return {
      greeting: `hello ${input?.text ?? "world"}`,
      jj: "jj",
    };
  },
});
