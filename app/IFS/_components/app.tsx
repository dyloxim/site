'use client'
import { useState } from 'react';

import { default as Canvas } from './canvas';
import { default as Controls } from './controls';
import { default as IFSApp } from '@IFS/app';

import { I_session } from '@IFS/types/state'
import { defaultDisplay } from '@IFS/resources/presets/displayPresets'
import { FunctionSystems } from '@IFS/resources/presets/FSPresets'


export default function App() {

  let preset = { display: defaultDisplay, FS: FunctionSystems.sierpinskiPentagon }

  const [session, updateSession] = useState<I_session>({
    settings: preset,
    state: IFSApp.getInitialState(preset) 
  });

  const appEngine = IFSApp.constructWithState(session);

  const setupApp = (displayContainer: HTMLDivElement) => {
    appEngine.setupDisplay(displayContainer);
    appEngine.start();
  }

  return (
    <div>
      <Canvas
        setupFn={setupApp}
        session={session}
        updateSession={updateSession}/>
      <Controls
        session={session}
        updateSession={updateSession}/>
    </div>
  )

}
