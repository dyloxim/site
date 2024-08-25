import Script from 'next/script'
import type { Metadata } from "next";
import Header from 'app/_coreUI/header';
import Footer from 'app/_coreUI/footer';
import { usePathname } from 'next/navigation'

export const metadata: Metadata = {
  title: "dyloxim.com · IFS"
};

export default function RootLayout({children}: Readonly<{children: React.ReactNode;}>) {
  return (
    <>

      
      <Header/>
      {children}
      <Footer/>

    </>
  );
}
