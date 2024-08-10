import { default as Toggle } from "@IFS/UI/inputTypes/toggle";
import SessionMutation from "@IFS/execution/sessionMutation";
import { I_UIContext, I_toggleInput } from "@IFS/types/UI";


const RunningToggle = ({ctx}: {ctx: I_UIContext}) => {


  const spec: I_toggleInput = {

    key: "startStopControl",
    onLabel: "■", offLabel: "▶",
    initial: ctx.session.state.options.running,
    effect: s => { return new SessionMutation({ using: s, do: s => {

      s.state.options.running = !s.state.options.running;
      return s;

    }})}

  }

  return (<> <Toggle ctx={ctx} spec={spec}/> </>)

}

export default RunningToggle;
