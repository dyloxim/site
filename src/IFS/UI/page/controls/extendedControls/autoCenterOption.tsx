import SessionMutation from "@IFS/execution/sessionMutation";
import CheckBox from "@IFS/UI/components/checkBox";
import { I_checkBox } from "@IFS/types/UI";
import { I_session } from "@IFS/types/state";

// NOT IMPLEMENTED

const AutoCenterOption = ({session}: {session: I_session}) => {

  const spec: I_checkBox = {
    key: "color",
    label: "Toggle Color",
    initial: session.state.options.color,
    effect: s => { return new SessionMutation({ using: s,

      do: s => s, queue: _ => ["DO:normaliseControlPoints"]

    })}
  }

  return (<> <CheckBox session={session} spec={spec}/> </>)
}

export default AutoCenterOption;
