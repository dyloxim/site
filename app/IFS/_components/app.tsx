'use client'
import { useState } from 'react';

import { default as Canvas } from './canvas';
import { default as Controls } from './controls';
import { default as IFSApp } from '@IFS/app';

import { I_session } from '@IFS/types/operationTypes'
import { defaultDisplay } from '@IFS/resources/presets/displayPresets'
import * as FunctionSystems from '@IFS/resources/presets/FSPresets'


export default function App() {

  let preset = { display: defaultDisplay, FS: FunctionSystems.barnsleyFern }

  const [session, updateSession] = useState<I_session>({
    settings: preset,
    state: IFSApp.getInitialState(preset.FS.firstPoint) 
  });

  const appEngine = IFSApp.constructWithState(session);

  return (
    <div>
      <Controls
        session={session}
        updateSession={updateSession}/>
      <Canvas appEngine={appEngine}/>
    </div>
  )

}
