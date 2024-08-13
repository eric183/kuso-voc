import fs from "fs";
import Cors from "cors";
import { NextApiRequest, NextApiResponse } from "next";
import yldl from "ytdl-core";
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
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const video = await yldl(req.query.url as string, {
      filter: "audioonly",
    }).pipe(fs.createWriteStream("video.mp4"));
    console.log("downloading.....");
    video.on("end", () => {
      res.status(200).json({ message: "Video downloaded successfully!" });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to download video!" });
  }
  // console.log(john);
  // return res.json(john);
}
