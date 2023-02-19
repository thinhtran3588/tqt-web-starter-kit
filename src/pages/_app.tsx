import { useRouter } from "next/router";
import Layout from "@app/common/components/layout";
import AuthLayout from "@app/auth/components/layout";
import type { AppProps } from "next/app";

export default function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  const router = useRouter();
  if (router.pathname.startsWith("/auth")) {
    return (
      <AuthLayout>
        <Component {...pageProps} />
      </AuthLayout>
    );
  }
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
