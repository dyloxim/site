import { default as Toggle } from "@IFS/UI/components/toggle";
import SessionMutation from "@IFS/execution/sessionMutation";
import { I_toggleInput } from "@IFS/types/UI";
import { useContext, useEffect, useState } from "react";
import { I_session } from "@IFS/types/state";
import { Ctx } from "@IFS/UI/SharedUIState";


const RunningToggle = ({session}: {session: I_session}) => {

  const {ctx, setCtx} = useContext(Ctx)
  const [choice, setChoice] = useState<boolean>(session.state.options.running)

  const spec: I_toggleInput = {

    key: "startStopControl",
    mainLabel: "Start / Stop",
    onLabel: "▶",
    offLabel: "■",
    initial: choice,

    effect: s => { return new SessionMutation({ using: s, do: s => {

      const newVal = !s.state.options.running;

      setChoice(newVal); s.state.options.running = newVal;
      setCtx({...ctx, running: newVal});
      return s;

    }})}

  }

  useEffect(() => {
    setChoice(ctx.running);
  }, [ctx]);

  return (<> <Toggle key={`${choice}`} spec={spec} session={session}/> </>)

}

export default RunningToggle;
