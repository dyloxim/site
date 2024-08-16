import SessionMutation from "@IFS/execution/sessionMutation";
import CheckBox from "@IFS/UI/components/checkBox";
import { I_checkBox } from "@IFS/types/UI";


const AxisOption = () => {

  const spec: I_checkBox = {
    key: "color",
    label: "Toggle Color",
    initial: false,
    effect: s => { return new SessionMutation({ using: s, do: s => {

      return s;

    }, queue: _ => ["DO:normaliseControlPoints"]

    })}
  }

  return (<> <CheckBox spec={spec}/> </>)
}

export default AxisOption;
