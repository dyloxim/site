'use client'

import { I_displayConfig, I_functionSystem } from '@IFS/types/configuration';

import { default as EventHandlers } from './display/eventHandlers';

import { default as Info } from './info';
import { default as ExtendedControls } from './controls/extendedControls';
import { default as QuickControls } from './controls/quickControls';
import { default as NavControls } from './controls/navControls';
import { default as ReadOut } from './readOut/panel';

import { useEffect, useRef, useState } from 'react';
import { default as AppEngine } from "@IFS/app";
import { initialSharedState, SharedUIState } from '@IFS/UI/SharedUIState';
import { I_sharedState } from '@IFS/types/state';
import { I_transform } from '@IFS/types/mathematical';




// the top level entry point component for the IFS app

export default function App({ preset }: {
  preset: {
    display: I_displayConfig,
    FS: I_functionSystem
  }
}) {


  let session = {
    settings: preset,
    state: AppEngine.getInitialState(preset) 
  }

  const [ctx, setCtx] = useState<I_sharedState>({
    path: session.state.options.path,
    FS: session.settings.FS.transforms
  })

  let app: AppEngine = AppEngine.constructWithState(session);

  const setFS = (FS: I_transform[]): void => setCtx({...ctx, FS});

  const setupApp = (displayContainer: HTMLDivElement) => {
    app.setupDisplay(displayContainer);
    app.start();
    let canvas = document.getElementById("hoverOverlayCanvas")! as HTMLCanvasElement;
    EventHandlers.forEach(handlerInit => { handlerInit(canvas, session, setFS) });
  }

  const displayContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {

    if (displayContainerRef.current) {

      let width = document.body.clientWidth;
      displayContainerRef.current!.style.width = `${width}px`;
      displayContainerRef.current!.style.height = `${window.innerHeight - 180}px`;
      setupApp(displayContainerRef.current);

    }

    window.addEventListener('resize', _ => {
      let width = document.body.clientWidth
      displayContainerRef.current!.style.width = `${width}px`;
      displayContainerRef.current!.style.height = `${window.innerHeight - 180}px`;
      setupApp(displayContainerRef.current!)
    })


  }, [ctx])

  return (
    <>
      <div
        id="displayContainer"
        ref={displayContainerRef}
        style={{
          position: "relative",
          border: "solid #2d2d2f 1px"
        }}>
      </div>
      <br/>
      {// <NavControls ctx={UIContext}/>
      }
      <SharedUIState.Provider value={{ctx, setCtx}}>
        <QuickControls session={session}/>
        {// <ExtendedControls ctx={UIContext}/>
        }
        <ReadOut session={session}/>
        {// <Info/>
        }
      </SharedUIState.Provider>
    </>
  )

}
