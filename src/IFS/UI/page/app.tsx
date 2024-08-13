'use client'

import { I_displayConfig, I_functionSystem } from '@IFS/types/configuration';

import { default as EventHandlers } from './display/eventHandlers';

import { default as Canvas } from './display/canvas';
import { default as Info } from './info';
import { default as ExtendedControls } from './controls/extendedControls';
import { default as QuickControls } from './controls/quickControls';
import { default as NavControls } from './controls/navControls';
import { default as ReadOut } from './readOut/panel';

import { useState } from 'react';
import { default as AppEngine } from "@IFS/app";
import { initialSharedState, SharedUIState } from '@IFS/UI/SharedUIState';
import { I_sharedState } from '@IFS/types/state';




// the top level entry point component for the IFS app

export default function App({ preset }: {
  preset: {
    display: I_displayConfig,
    FS: I_functionSystem
  }
}) {

  const [ctx, setCtx] = useState<I_sharedState>(initialSharedState);

  let session = {
    settings: preset,
    state: AppEngine.getInitialState(preset) 
  }

  let app: AppEngine = AppEngine.constructWithState(session);

  const setupApp = (displayContainer: HTMLDivElement) => {

    app.setupDisplay(displayContainer);
    app.start();
    let canvas = document.getElementById("hoverOverlayCanvas")! as HTMLCanvasElement;
    EventHandlers.forEach(handlerInit => { handlerInit(canvas, session) });

  }


  return (
    <>
      <Canvas setupFn={setupApp} app={app}/>
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
