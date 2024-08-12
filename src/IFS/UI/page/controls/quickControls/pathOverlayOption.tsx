import {default as Button } from "@IFS/UI/components/button";

import { I_buttonInput } from "@IFS/types/UI";
import SessionMutation from "@IFS/execution/sessionMutation";
import * as Globals from "@IFS/resources/globalConstants"
import { useState, useEffect } from "react";
import { I_session } from "@IFS/types/state";


const PathOverlayControls = ({session}: {session: I_session}) => {

  const [selection, setSelection] = useState<
    string | null
  >(session.state.options.path);

  const specs: I_buttonInput[] = [

    { key: 'None' },
    { key: 'Fleeting' },
    { key: 'Persistent' },

  ].map(option => {

    return {

      key: option.key,
      label: option.key,
      effect: s => { return new SessionMutation({ using: s, do: s => {


        const newVal = (
          s.state.options.animationRate < Globals.pathDrawThreshold ?
            option.key : 'None'
        ) as 'None' | 'Fleeting' | 'Persistent';
        setSelection(newVal);
        s.state.options.path = newVal;
        return s;

      }, queue: _ => option.key !== "None" ? [] : [["ERASE", ["pathOverlay"]]]

      })}} as I_buttonInput

  });

  useEffect(() => {
    setSelection(() => session.state.options.path);
  }, [session.state.options.path])

  return (
    <span style={{whiteSpace: "nowrap"}}>

      Path: {specs.map(spec => (
        <Button
          session={session}
          classes={selection == spec.key ? "active" : "inactive"}
          key={spec.key}
          spec={spec}/>
        ))}

    </span>)
}

export default PathOverlayControls;
