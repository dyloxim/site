'use client'

import { useState } from 'react';

import { I_session } from '@IFS/types/state'
import { I_displayConfig, I_functionSystem } from '@IFS/types/configuration';

import { default as AppEngine } from '@IFS/app';
import { default as EventHandlers } from './display/eventHandlers';

import { default as Canvas } from './display/canvas';
import { default as Info } from './info';
import { default as ExtendedControls } from './controls/extendedControls';
import { default as QuickControls } from './controls/quickControls';
import { default as NavControls } from './controls/navControls';
import { default as ReadOut } from './readOut/panel';






// the top level entry point component for the IFS app

export default function App({ preset }: {
  preset: {
    display: I_displayConfig,
    FS: I_functionSystem
  }
}) {

  let [session, updateSession] = useState<I_session>({
    settings: preset,
    state: AppEngine.getInitialState(preset) 
  });

  const UIContext = { session: session, updateSession: updateSession };

  const app = AppEngine.constructWithState(session);

  const setupApp = (displayContainer: HTMLDivElement) => {

    app.setupDisplay(displayContainer);
    let canvas = document.getElementById("hoverOverlayCanvas")! as HTMLCanvasElement;
    EventHandlers.forEach(handlerInit => { handlerInit(canvas, session, updateSession) });
    app.start();

  }

  return (
    <>
      <Canvas setupFn={setupApp}/>
      <br/>
      <p>FS:</p> <pre>$CURRENT</pre>
      { // <NavControls ctx={UIContext}/>
      }
      <QuickControls ctx={UIContext}/>
      { // <ExtendedControls ctx={UIContext}/>
      }
      { // <ReadOut/>
      }
      { // <Info/>
      }
    </>
  )

}
