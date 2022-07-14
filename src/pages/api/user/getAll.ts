import { prismaClient } from "../../../server/prisma";

export default async function assetHandler(req, res) {
  const { method } = req;
  const data = await prismaClient.userList.findMany({
    where: {
      email: {
        endsWith: "gmail.com",
      },
    },
  });
  console.log(data);
  return res.json(data);
}
