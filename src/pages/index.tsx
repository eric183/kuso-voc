// import type { NextPage } from "next";
// import Image from "next/image";
// import styles from "../styles/Home.module.css";

import Head from "next/head";
import { NextPage } from "next";
import { trpc } from "~/utils/trpc";
import { DefaultLayout } from "~/components/DefaultLayout";
import { useSession, signOut, signIn } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/router";
// import "../../styles/globals.css";

const Home: NextPage = () => {
  const { data } = useSession();
  const router = useRouter();
  // console.log(data);

  useEffect(() => {
    console.log("inited");

    if (data?.user?.email) {
      router.replace("/kanban");
    }
  }, [data, router]);
  // const hello = trpc.useQuery(["hello.all"]);
  // const userInfo = trpc.useQuery([
  //   "userInfo.get",
  //   {
  //     email: "kk297466058@gmail.com",
  //   },
  // ]);

  // if (!hello.data) {
  //   return <div>Loading...</div>;
  // }

  // const user = userInfo.data ?? undefined;

  return (
    <DefaultLayout>
      <main className="flex justify-center items-center bg-gradient-to-r from-indigo-500 via-purple-500 to-purple-700 h-screen w-screen overflow-hidden font-sans text-white">
        <header>
          <div className="font-mono absolute left-5 top-3 font-extrabold text-xl">
            KusoVoc
          </div>
          {/* <p className="text-center m-10">
            A translation application for my babe
          </p> */}
        </header>
        <div className="flex justify-center items-center w-96 h-96 m-auto rounded-2xl">
          <div className="flex flex-col items-center justify-center text-2xl">
            <button onClick={() => signIn()}>登录</button>
          </div>
        </div>
      </main>
    </DefaultLayout>
  );
};

export default Home;
