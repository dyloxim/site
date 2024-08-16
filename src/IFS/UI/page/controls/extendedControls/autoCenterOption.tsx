import SessionMutation from "@IFS/execution/sessionMutation";
import CheckBox from "@IFS/UI/components/checkBox";
import { I_checkBox } from "@IFS/types/UI";

// NOT IMPLEMENTED

const AutoCenterOption = () => {

  const spec: I_checkBox = {
    key: "color",
    label: "Toggle Color",
    initial: false,
    effect: s => { return new SessionMutation({ using: s,

      do: s => s, queue: _ => ["DO:normaliseControlPoints"]

    })}
  }

  return (<> <CheckBox spec={spec}/> </>)
}

export default AutoCenterOption;
