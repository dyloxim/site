import type { Metadata } from "next";
import './global.css';
import Header from "./_coreUI/header";
import Footer from "./_coreUI/footer";

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
        {children}
      </body>
    </html>
  );
}
