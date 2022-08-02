import { WordData } from "@prisma/client";
import Cors from "cors";

import { prismaClient } from "~/server/prisma";

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
      sentences: any;
    };
  },
  res: { json: (arg0: { content?: string; data?: WordData }) => any }
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

  const data = await prismaClient.wordData.upsert({
    where: {
      searchingWord: req.body.searchingWord,
    },
    update: {
      userWords: {
        connectOrCreate: {
          where: {
            word_usermail: {
              usermail: req.body.email,
              word: req.body.searchingWord,
            },
          },
          create: {
            usermail: req.body.email,
          },
        },
      },
    },
    create: {
      searchingWord: req.body.searchingWord,
      searchingEngine: req.body.searchingEngine,
      translations: req.body.translations
        ? req.body.translations
        : req.body.sentences,
      userWords: {
        connectOrCreate: {
          where: {
            word_usermail: {
              usermail: req.body.email,
              word: req.body.searchingWord,
            },
          },
          create: {
            usermail: req.body.email,
          },
        },
      },
    },
  });

  return res.json({ data });
}
