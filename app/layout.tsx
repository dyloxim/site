import type { Metadata } from "next";
import 'normalize.css'
import './reset.css'
import './global.css';
import Header from 'app/_coreUI/header';
import Footer from 'app/_coreUI/footer';

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
