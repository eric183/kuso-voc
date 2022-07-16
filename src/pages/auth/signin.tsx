import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getCsrfToken, getProviders, signIn } from "next-auth/react";
import { useState } from "react";
import styles from "./Signin.module.css";

interface Credentials {
  id: string;
  name: string;
  type: string;
  signinUrl: string;
  callbackUrl: string;
}

export default function SignIn({
  providers,
  csrfToken,
}: {
  providers: {
    credentials: Credentials;
  };
  [key: string]: any;
}) {
  const [email, setEmail] = useState<string>("");
  return (
    <div style={{ overflow: "hidden", position: "relative" }}>
      {/* <Header /> */}
      <div className={styles.wrapper + " bg-slate-400"} />
      <div className={styles.content}>
        <div className={styles.cardWrapper}>
          {/* <Image
            src="/katalog_full.svg"
            width="196px"
            height="64px"
            alt="App Logo"
            style={{ height: "85px", marginBottom: "20px" }}
          /> */}
          <form
            className={styles.cardContent}
            onSubmit={(evt) => {
              evt.preventDefault();
              signIn(providers.credentials.id, { email });
            }}
          >
            <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
            <input
              autoComplete="on"
              placeholder="Please enter your email"
              size={30}
              value={email}
              onInput={(evt) => {
                setEmail((evt.target as HTMLInputElement).value);
              }}
              onKeyDown={(evt) => {
                if (evt.key === "Enter") {
                  signIn(providers.credentials.id, { email });
                }
              }}
            />
            <button
              className={styles.primaryBtn}
              type="submit"
              onClick={() => {
                signIn(providers.credentials.id, { email });
              }}
            >
              登录
            </button>
            <hr />
            {/* {providers &&
              Object.values(providers).map((provider) => (
                <div key={provider.name} style={{ marginBottom: 0 }}>
                  <button onClick={() => signIn(provider.id, { email })}>
                    登录
                  </button>
                </div>
              ))} */}
          </form>
        </div>
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/dragon.jpg"
        alt="Pattern Background"
        className={styles.styledPattern}
      />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const providers = await getProviders();
  const csrfToken = await getCsrfToken(context);
  return {
    props: {
      providers,
      csrfToken,
    },
  };
};
