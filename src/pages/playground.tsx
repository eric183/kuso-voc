import { NextPage } from "next";
import { trpc } from "~/utils/trpc";
import { DefaultLayout } from "~/components/DefaultLayout";
import { useSession, signIn, signOut } from "next-auth/react";
import { FC, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Spinner, Tooltip } from "@chakra-ui/react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import styled from "@emotion/styled";
import yldl from "ytdl-core";

interface TranslationDataInterface {
  data: {
    id: string;
    score: number;
    master: boolean;
    wordData: KanbanPageProps;
  }[];
  status: "error" | "idle" | "loading" | "success";
}

interface KanbanPageProps {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  searchingWord: string;
  searchingEngine: string;
  translations: {
    pos?: string;

    orig?: string;
    trans?: string;
    terms?: {
      name?: string;
    }[];
    entries?: {
      word?: string;
      score?: number;
      reverse_translations?: { name?: string }[];
    }[];
  }[];
}

interface StateInterface {
  noob?: {
    wordData: KanbanPageProps;
    id: string;
    score: number;
    master: boolean;
  }[];
  master?: {
    wordData: KanbanPageProps;
    id: string;
    score: number;
    master: boolean;
  }[];
}

const Playground: NextPage = () => {
  const sessionInfo = useSession();
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState("");

  const handleDownload = async () => {
    setStatus("downloading...");
    const info = await yldl.getInfo(url);
    const format = yldl.chooseFormat(info.formats, { quality: "highest" });
    await yldl
      .downloadFromInfo(info, { format })
      .on("progress", (_, downloaded, total) => {
        setStatus(`downloading... ${downloaded}/${total}`);
      })
      .on("end", () => {
        setStatus("download complete");
      });
  };

  useEffect(() => {
    setTimeout(() => {
      console.log("post");
      fetch(
        "/api/youtube?url=https://www.youtube.com/watch?v=TbmSCdn_iUo&list=PLTAZjYj11Ibr6UqU2c6Sva50nuSveCezT&index=5&t=1s"
      ).then((d) => {
        console.log(d);
      });
    }, 3000);
  }, []);
  // console.log(sessionInfo);
  return (
    <DefaultLayout>
      <div className="bg-[#B7B8B6] h-screen w-screen overflow-hidden flex flex-col text-[#333333]">
        <header className="grid grid-cols-12 gap-4 py-3 pl-8 font-extrabold">
          ~Aloha~
        </header>

        {/* <div>
          <input value={url} onChange={(e) => setUrl(e.target.value)} />
          <button onClick={handleDownload}>Download</button>
          <p>{status}</p>
        </div> */}
      </div>
    </DefaultLayout>
  );
};

export default Playground;

// [
// #E6D1C1
// #C8AD7F
// #B7B8B6
// #8E9AAF
// #D6E0F0
// #F0E0D6
// #E0F0D6
// #D6F0E0
// #F0D6E0
// #D6E0F0
// ]

// 这里是一组适合用于文字配色的颜色：

// 深灰色：#333333
// 浅灰色：#999999
// 白色：#FFFFFF
// 浅黄色：#FFE066
// 浅蓝色：#70C1B3
// 浅绿色：#77DD77
// 这些颜色可以搭配使用，例如：

// 深灰色文本和浅灰色背景
// 白色文本和深灰色背景
// 浅黄色文本和深灰色背景
// 浅蓝色文本和浅灰色背景
// 浅绿色文本和深灰色背景
// 当然，具体的搭配方式还要看具体情况，比如页面的主题和风格等。
