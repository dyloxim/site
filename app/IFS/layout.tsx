import Script from 'next/script'
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "dyloxim.com · IFS"
};

export default function RootLayout({children}: Readonly<{children: React.ReactNode;}>) {
  return (
    <>

      <Script src="webpack/IFS.bundle.js"/>

      {children}

    </>
  );
}
