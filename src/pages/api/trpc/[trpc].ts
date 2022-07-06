// import * as trpc from "@trpc/server";
// import * as trpcNext from "@trpc/server/adapters/next";
// import { z } from "zod";

// export const appRouter = trpc.router().query("hello", {
//   input: z
//     .object({
//       text: z.string().nullish(),
//     })
//     .nullish(),
//   resolve({ input }) {
//     return {
//       greeting: `hello ${input?.text ?? "world"}`,
//       jj: "jj",
//     };
//   },
// });

// // export type definition of API
// export type AppRouter = typeof appRouter;

// // export API handler
// export default trpcNext.createNextApiHandler({
//   router: appRouter,
//   createContext: () => null,
// });

/**
 * This file contains tRPC's HTTP response handler
 */
import * as trpcNext from "@trpc/server/adapters/next";
import { createContext } from "~/server/context";
import { appRouter } from "~/server/routers/_app";

export default trpcNext.createNextApiHandler({
  // router: appRouter,
  router: appRouter,
  /**
   * @link https://trpc.io/docs/context
   */
  createContext,
  /**
   * @link https://trpc.io/docs/error-handling
   */
  onError({ error }) {
    if (error.code === "INTERNAL_SERVER_ERROR") {
      // send to bug reporting
      console.error("Something went wrong", error);
    }
  },
  /**
   * Enable query batching
   */
  batching: {
    enabled: true,
  },
  /**
   * @link https://trpc.io/docs/caching#api-response-caching
   */
  // responseMeta() {
  //   // ...
  // },
});
