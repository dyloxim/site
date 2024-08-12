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

  const app = AppEngine.constructWithState(session);

  const setupApp = (displayContainer: HTMLDivElement) => {

    app.setupDisplay(displayContainer);
    let canvas = document.getElementById("hoverOverlayCanvas")! as HTMLCanvasElement;
    EventHandlers.forEach(handlerInit => { handlerInit(canvas, session) });
    app.start();

  }

  return (
    <>
      <Canvas setupFn={setupApp}/>
      <br/>
      {
        // <NavControls ctx={UIContext}/>
      }
      <QuickControls session={session}/>
      {
        // <ExtendedControls ctx={UIContext}/>
      }
      {
        // <ReadOut/>
      }
      {
        // <Info/>
      }
    </>
  )

}
