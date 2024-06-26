import Script from 'next/script'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Script type="text/javascript" id="MathJax-script" async
        src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js"/>
      <Script src="webpack/IFS.bundle.js"/>
      {children}
    </div>
  );
}
