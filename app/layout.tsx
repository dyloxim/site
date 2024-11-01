import type { Metadata } from "next";
import 'normalize.css';
import './reset.css';
import './global.css';
import Header from 'app/_coreUI/header';
import Footer from 'app/_coreUI/footer';
import type { Viewport } from 'next'

export const viewport: Viewport = {
  width:' device-width',
  height: 'device-height',
  maximumScale: 1,
  initialScale: 1,
  minimumScale: 1,
  userScalable: false,
}

export const metadata: Metadata = {
  title: "dyloxim.com"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{color: "#f2f2f0", backgroundColor: "#0c0c0e"}}>
        <Header/>
        {children}
        <Footer/>
      </body>
    </html>
  );
}
