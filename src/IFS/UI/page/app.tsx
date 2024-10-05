'use client'
import { I_displayConfig, I_functionSystem } from '@IFS/types/configuration';

import { default as ReadOut } from './readOut/panel';
import { default as Canvas } from './canvas';

import { useState } from 'react';
import { Ctx } from '@IFS/UI/SharedUIState';
import { default as AppEngine } from "@IFS/app";
import Controls from "./controls";
import { I_UIContext } from '@IFS/types/UI';
import "@Util/IFSUIFont";
import "./app.module.css";


export default function App({ preset }: {
  preset: {
    display: I_displayConfig,
    FS: I_functionSystem
    getRandom: () => number,
  }
}) {

  let session = {
    settings: preset,
    state: AppEngine.getInitialState(preset) 
  }

  let app: AppEngine = AppEngine.constructWithState(session);  

  const [ctx, setCtx] = useState<I_UIContext>({
    FS: session.settings.FS.transforms,
    path: "None",
    pathDisabled: false
  })


  return (
    <Ctx.Provider value={{ctx, setCtx}}>
      <div id="app" style={{}}>
        <Canvas session={session} app={app} preset={preset}/>
        <br/>
        <Controls session={session}/>
        <hr style={{backgroundColor: "black", borderColor: "#333"}}/>
        <ReadOut session={session}/>
      </div>
    </Ctx.Provider>
  )

}
