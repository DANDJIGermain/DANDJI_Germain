
import config from "@config/config.json";
import { Head, Html, Main, NextScript } from "next/document";

const Document = () => {
  // destructuring items from config object
  const { favicon } = config.site;
  return (
    <Html lang="en">
      <Head>
        {/* favicon */}
        <link rel="shortcut icon" href={favicon} />
        {/* theme meta */}
        <meta name="theme-name" content="geeky-nextjs" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta
          name="theme-color"
          media="(prefers-color-scheme: light)"
          content="#fff"
        />
        <meta
          name="theme-color"
          media="(prefers-color-scheme: dark)"
          content="#000"
        />
        {/* Google Search Console Verification */}
        {config.params?.google_site_verification && (
          <meta
            name="google-site-verification"
            content={config.params.google_site_verification}
          />
        )}
      </Head>
      <body>
        <Main />

        <NextScript />
      </body>
    </Html>
  );
};

export default Document;
