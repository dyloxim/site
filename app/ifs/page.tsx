'use client'
import App from '@IFS/UI/page/app';
import { defaultDisplay } from '@IFS/resources/presets/displayPresets';
import { FunctionSystems } from '@IFS/resources/presets/FSPresets';
import Link from 'next/link';
import Script from 'next/script';

export default function IFSPage() {

  let preset = {
    display: defaultDisplay,
    FS: FunctionSystems.colorSpace,
    getRandom: () => 0
  }

  return (
    <>
      <App preset={preset} />
      <hr style={{backgroundColor: "black", borderColor: "#333"}}/>
      <div style={{padding: "1em"}}>
        <Link href="ifs/about">🖇 About</Link>
      </div>
      <Script src="/webpack/ifs.bundle.js"/>
    </>
  )
}
