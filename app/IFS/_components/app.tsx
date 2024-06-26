'use client'
import { useState } from 'react';
import I_session from '@IFS/types/I_session'
import * as Presets from '@IFS/resources/presets'
import Canvas from './canvas';
import Controls from './controls';
import IFSApp from '@IFS/app';

export default function App() {

  let preset = Presets.barnsleyFern;

  const [session, updateSession] = useState<I_session>({
    settings: preset,
    state: IFSApp.getInitialState(preset.program.firstPoint) 
  });

  const appEngine = IFSApp.constructWithState(session);

  return (
    <div>
      <Canvas appEngine={appEngine}/>
      <Controls
        session={session}
        updateSession={updateSession}/>
    </div>
  )
}
