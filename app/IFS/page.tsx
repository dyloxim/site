'use client'
import App from './_components/app'
import { defaultDisplay } from '@IFS/resources/presets/displayPresets'
import { FunctionSystems } from '@IFS/resources/presets/FSPresets'

export default function IFSPage() {

  let preset = {
    display: defaultDisplay,
    FS: FunctionSystems.heighwayDragon
  }

  return (<App preset={preset} />)
}
