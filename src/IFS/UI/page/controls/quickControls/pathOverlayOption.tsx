import {default as Button } from "@IFS/UI/components/button";

import { I_buttonInput } from "@IFS/types/UI";
import SessionMutation from "@IFS/execution/sessionMutation";
import * as Globals from "@IFS/resources/globalConstants"
import { useContext } from "react";
import { I_session } from "@IFS/types/state";
import { SharedUIState } from "@IFS/UI/SharedUIState";
import { PathOptions } from "@IFS/resources/globalConstants"


const PathOverlayControls = ({session}: {session: I_session}) => {

  const {ctx, setCtx} = useContext(SharedUIState);

  const specs: I_buttonInput[] = PathOptions.map(option => {

    return {

      key: option,
      label: option,
      effect: s => { return new SessionMutation({ using: s, do: s => {


        const newVal =
          (
            s.state.options.animationRate < Globals.pathDrawThreshold ?
              option
              :
              'None'
          )
        s.state.options.path = newVal;
        setCtx({...ctx, path: newVal });
        return s;

      }, queue: _ => [["ERASE", ["pathOverlay"]]]

      })}} as I_buttonInput

  });

  return (
    <span style={{whiteSpace: "nowrap"}}>

      Path: {specs.map(spec => (
        <Button
          session={session}
          classes={ctx.path == spec.key ? "active" : "inactive"}
          key={spec.key}
          spec={spec}/>
        ))}

    </span>)
}

export default PathOverlayControls;
