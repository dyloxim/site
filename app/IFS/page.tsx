'use client'
import App from '@IFS/UI/page/app';
import { defaultDisplay } from '@IFS/resources/presets/displayPresets';
import { FunctionSystems } from '@IFS/resources/presets/FSPresets';
import Link from 'next/link';

export default function IFSPage() {

  let preset = {
    display: defaultDisplay,
    FS: FunctionSystems.colorSpace
  }

  return (
    <>
      <App preset={preset} />
      <hr style={{backgroundColor: "black", borderColor: "#333"}}/>
      <div style={{padding: "1em"}}>
      <Link href="IFS/about">🖇 About</Link>
    </div>
    </>
  )
}
