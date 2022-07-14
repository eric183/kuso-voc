/**
 *
 * This is an example router, you can delete this file and then update `../pages/api/trpc/[trpc].tsx`
 */
import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
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

// export const commentRouter = createRouter()
//   // create
//   .mutation("add", {
//     input: z.object({
//       id: z.string().uuid().optional(),
//       name: z.string().min(1),
//       text: z.string().min(1),
//     }),
//     async resolve({ input }) {
//       const comment = await prisma.comment.create({
//         data: input,
//         select: defaultCommentSelect,
//       });
//       return comment;
//     },
//   })
//   // read
//   .query("all", {
//     async resolve() {
//       /**
//        * For pagination you can have a look at this docs site
//        * @link https://trpc.io/docs/useInfiniteQuery
//        */

//       return prisma.comment.findMany({
//         select: defaultCommentSelect,
//       });
//     },
//   })
//   .query("byId", {
//     input: z.object({
//       id: z.string(),
//     }),
//     async resolve({ input }) {
//       const { id } = input;
//       const comment = await prisma.comment.findUnique({
//         where: { id },
//         select: defaultCommentSelect,
//       });
//       if (!comment) {
//         throw new TRPCError({
//           code: "NOT_FOUND",
//           message: `No comment with id '${id}'`,
//         });
//       }
//       return comment;
//     },
//   })
//   // update
//   .mutation("edit", {
//     input: z.object({
//       id: z.string().uuid(),
//       data: z.object({
//         text: z.string().min(1).optional(),
//       }),
//     }),
//     async resolve({ input }) {
//       const { id, data } = input;
//       const comment = await prisma.comment.update({
//         where: { id },
//         data,
//         select: defaultCommentSelect,
//       });
//       return comment;
//     },
//   })
//   // delete
//   .mutation("delete", {
//     input: z.object({
//       id: z.string(),
//     }),
//     async resolve({ input }) {
//       const { id } = input;
//       await prisma.comment.delete({ where: { id } });
//       return {
//         id,
//       };
//     },
//   });
