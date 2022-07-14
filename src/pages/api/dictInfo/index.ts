// import { WordCard } from "@prisma/client";
import Cors from "cors";
import { connect } from "http2";

import { prismaClient } from "~/server/prisma";
import { trpc } from "~/utils/trpc";

const cors = Cors({
  methods: ["POST", "HEAD"],
});

function runMiddleware(
  req: any,
  res: any,
  fn: (arg0: any, arg1: any, arg2: (result: any) => void) => void
) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: unknown) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}

export default async function assetHandler(
  req: {
    body: {
      email: string;
      searchingWord: string;
      searchingEngine: string;
      translations: any;
    };
  },
  res: { json: (arg0: { content?: string; name?: string }) => any }
) {
  await runMiddleware(req, res, cors);

  const foundUser = await prismaClient.user.findUnique({
    where: {
      email: req.body.email as string,
    },
  });

  if (!foundUser) {
    return res.json({ content: "请联系 eric183 获取权限" });
  }

  prismaClient.$transaction([
    prismaClient.wordData.upsert({
      where: {
        searchingWord: req.body.searchingWord,
      },
      update: {},
      create: {
        searchingWord: req.body.searchingWord,
        searchingEngine: req.body.searchingEngine,
        translations: req.body.translations,
      },
    }),
    prismaClient.user.update({
      where: {
        email: req.body.email,
      },
      data: {
        words: {
          connectOrCreate: {
            where: {
              word: req.body.searchingWord,
            },
            create: {
              word: req.body.searchingWord,
            },
          },
        },
      },
    }),
  ]);

  return res.json({ name: "nice" });
}
