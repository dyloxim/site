'use client'
import { I_displayConfig, I_functionSystem } from '@IFS/types/configuration';

import { default as ReadOut } from './readOut/panel';

import { useEffect, useRef, useState } from 'react';
import { Ctx } from '@IFS/UI/SharedUIState';
import { default as AppEngine } from "@IFS/app";
import getPageLoader from "@IFS/UI/util/getPageLoader";
import resizeFn from '../util/resizeFn';
import Controls from './controls';
import { I_transform } from '@IFS/types/mathematical';
import { I_UIContext } from '@IFS/types/UI';


// the top level entry point component for the IFS app

export default function App({ preset }: {
  preset: {
    display: I_displayConfig,
    FS: I_functionSystem
  }
}) {

  // const {context, context} = useContext(SharedUIState)
  const container = useRef<HTMLDivElement | null>(null);
  let session = {
    settings: preset,
    state: AppEngine.getInitialState(preset) 
  }
  let app: AppEngine = AppEngine.constructWithState(session);  
  const [ctx, setCtx] = useState<I_UIContext>({ FS: [] })

  let onLoad = () => {
    let loader = getPageLoader({
      app: app, 
      container: container.current!,
      session: session,
      preset: preset,
      contextUpdater: setCtx,
      resizeFn: resizeFn
    });
    loader();
  }



  useEffect(() => {

    if (document.readyState === 'complete') onLoad();

    else {
      window.addEventListener('load', onLoad, false);
      return () => window.removeEventListener('load', onLoad);
    }

  }, []);

  return (
    <Ctx.Provider value={{ctx, setCtx}}>
      <div
        id="displayContainer"
        ref={container}
        style={{
          position: "relative",
          border: "solid #2d2d2f 1px"
        }}>
      </div>
      <br/>
      <Controls session={session}/>
      <ReadOut session={session}/>
    </Ctx.Provider>
  )

}
