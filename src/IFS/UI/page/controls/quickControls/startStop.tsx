import { default as Toggle } from "@IFS/UI/components/toggle";
import SessionMutation from "@IFS/execution/sessionMutation";
import { I_toggleInput } from "@IFS/types/UI";
import { SharedUIState } from '@IFS/UI/SharedUIState';
import { useContext } from "react";


const RunningToggle = () => {

  const {session} = useContext(SharedUIState)

  const spec: I_toggleInput = {

    key: "startStopControl",
    mainLabel: "Start / Stop",
    onLabel: "■", offLabel: "▶",
    initial: session.state.options.running,
    effect: s => { return new SessionMutation({ using: s, do: s => {

      s.state.options.running = !s.state.options.running;
      return s;

    }})}

  }

  return (<> <Toggle spec={spec}/> </>)

}

export default RunningToggle;
