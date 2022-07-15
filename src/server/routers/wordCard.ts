/**
 *
 * This is an example router, you can delete this file and then update `../pages/api/trpc/[trpc].tsx`
 */
import { prisma, Prisma } from "@prisma/client";
import { z } from "zod";
import { createRouter } from "~/server/createRouter";
import { prismaClient } from "~/server/prisma";

/**
 * Default selector for comment.
 * It's important to always explicitly say which fields you want to return in order to not leak extra information
 * @see https://github.com/prisma/prisma/issues/9353
 */

const defaultCommentSelect = Prisma.validator<Prisma.UserSelect>()({
  name: true,
  email: true,
  // isAdmin: true,
  // isActive: true,
  // words: true,
});

export const wordCardRouter = createRouter()
  .mutation("updateMaster", {
    input: z.object({
      id: z.string(),
      email: z.string(),
      master: z.boolean(),
    }),
    async resolve({ input }) {
      const word = await prismaClient.user.update({
        where: {
          email: input.email,
        },
        data: {
          words: {
            update: {
              where: {
                id: input.id,
              },
              data: {
                master: input.master,
              },
            },
          },
        },
      });
      // const word = await prismaClient.word.update({
      //   where: { id },
      //   data: { master },
      // });
      return word;
    },
  })
  .query("allVoc", {
    input: z
      .object({
        email: z.string(),
      })
      .nullish(),
    async resolve({ input }) {
      return await prismaClient.user
        .findUnique({
          where: {
            email: input?.email,
          },
          // select: defaultCommentSelect,
        })
        .words({
          select: {
            id: true,
            score: true,
            master: true,
            wordData: true,
            // createdAt: true,
          },
        });
    },
  });

// .mutation("add", {
//   input: z.object({
//     id: z.string().uuid().optional(),
//     searchingWord: z.string().min(1).max(32),
//     searchingEngine: z.string().min(1).max(32),
//     translations: z
//       .object({
//         id: z.string().uuid().optional(),
//         pos: z.string().nullish(),
//         terms: z
//           .object({
//             id: z.string().uuid().optional(),
//             explain: z.string().nullish(),
//           })
//           .array(),
//         entries: z
//           .object({
//             id: z.string().uuid().optional(),
//             word: z.string().nullish(),
//             reverse_translations: z
//               .object({
//                 id: z.string().uuid().optional(),
//                 name: z.string().nullish(),
//               })
//               .array(),
//           })
//           .array(),
//       })
//       .array(),
//   }),
//   // .nullish(),
//   async resolve({ input }) {
//     const post = prismaClient.wordCard.create({
//       data: input,
//     });

//     return post;

//     // return {
//     //   greeting: `hello ${input?.text ?? "world"}`,
//     //   jj: "jj",
//     // };
//   },
// });
