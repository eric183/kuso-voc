// import type { NextPage } from "next";
// import Image from "next/image";
// import styles from "../styles/Home.module.css";

import Head from "next/head";
import { NextPage } from "next";
import { trpc } from "~/utils/trpc";
import { DefaultLayout } from "~/components/DefaultLayout";
// import "../../styles/globals.css";

const Home: NextPage = () => {
  const hello = trpc.useQuery(["hello.all"]);
  const userInfo = trpc.useQuery([
    "userInfo.get",
    {
      email: "kk297466058@gmail.com",
    },
  ]);

  if (!hello.data) {
    return <div>Loading...</div>;
  }

  const user = userInfo.data ?? undefined;
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="text-3xl font-bold underline">
        <p className="underline decoration-sky-500 text-ellipsis">
          {hello.data.greeting}
        </p>

        <DefaultLayout>
          <div>hello?</div>

          <>{user ? user?.email : "no user"}</>
        </DefaultLayout>
      </main>
    </div>
  );
};

export default Home;
