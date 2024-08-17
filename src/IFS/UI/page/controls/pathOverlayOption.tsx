import {default as Button } from "@IFS/UI/components/button";

import { I_buttonInput } from "@IFS/types/UI";
import { I_session, PathOption } from "@IFS/types/state";
import SessionMutation from "@IFS/execution/sessionMutation";
import { pathDrawThreshold } from "@IFS/resources/globalConstants"
import { useContext, useState } from "react";
// import { SharedUIState } from "@IFS/UI/SharedUIState";
import { PathOptions } from "@IFS/resources/globalConstants"


const PathOverlayControls = ({session}: {session: I_session}) => {

  // const {context} = useContext(SharedUIState);
  const [choice, setChoice] = useState<PathOption>(session.state.options.path)

  const specs: I_buttonInput[] = PathOptions.map(option => { return {

      key: option,
      label: option,

    effect: s => { return new SessionMutation({ using: s, do: s => {

        const newVal =
          (s.state.options.animationRate < pathDrawThreshold ? option : 'None')

        setChoice(newVal); s.state.options.path = newVal;
        return s;

      }, queue: _ => [["ERASE", ["pathOverlay"]]]})}};

  });

  return (
    <span style={{whiteSpace: "nowrap"}}>

      Path: {specs.map(spec => (
        <Button
          classes={choice == spec.key ? "active" : "inactive"}
          key={spec.key}
          spec={spec}
          session={session}
        />
        ))}

    </span>)
}

export default PathOverlayControls;