import { default as Toggle } from "@IFS/UI/components/toggle";
import SessionMutation from "@IFS/execution/sessionMutation";
import { I_toggleInput } from "@IFS/types/UI";
import { I_session } from "@IFS/types/state";


const RunningToggle = ({session}: {session: I_session}) => {

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

  return (<> <Toggle session={session} spec={spec}/> </>)

}

export default RunningToggle;
