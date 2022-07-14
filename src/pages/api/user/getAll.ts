import { User } from "@prisma/client";
import { prismaClient } from "../../../server/prisma";

export default async function assetHandler(
  req: { method: any },
  res: { json: (arg0: User[]) => any }
) {
  const { method } = req;
  const data = await prismaClient.user.findMany({
    where: {
      email: {
        endsWith: "gmail.com",
      },
    },
  });
  console.log(data);
  return res.json(data);
}
