// import { Alert, AlertIcon } from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import { getCsrfToken, getProviders, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { Button } from "~/components/Button";
import styles from "../../../styles/Signin.module.css";

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
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const goSignIn = async (providers: { credentials: Credentials }) => {
    setLoading(true);
    if (!email.trim()) {
      alert("Email is required");

      setLoading(false);
      return;
    }
    const signInfo = await signIn(providers.credentials.id, {
      email,
      redirect: false,
    });
    setLoading(false);

    if (signInfo?.error) {
      alert(signInfo?.error);
      return;
    }

    router.replace("/kanban");
  };

  return (
    <div style={{ overflow: "hidden", position: "relative" }}>
      {/* <Alert status="info" className="z-50">
        <AlertIcon />
        Chakra is going live on August 30th. Get ready!
      </Alert> */}
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
              goSignIn(providers);
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
                  goSignIn(providers);

                  // signIn(providers.credentials.id, { email });
                }
              }}
            />

            <Button type="submit" loading={loading}>
              登录
            </Button>
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
