import SessionMutation from "@IFS/execution/sessionMutation";
import CheckBox from "@IFS/UI/components/checkBox";
import { I_checkBox } from "@IFS/types/UI";
import { useState } from "react";
import { I_session } from "@IFS/types/state";

const AxisToggle = ({session}: {session: I_session}) => {

  const [val, setVal] = useState<boolean>(session.state.options.axis);

  const spec: I_checkBox = {
    key: "axis",
    label: "Axis",
    initial: val,
    effect: s => { return new SessionMutation({ using: s, do: s => {

      s.state.options.axis = !s.state.options.axis;
      setVal(!s.state.options.axis);
      return s;

    }, queue: s => [!s.state.options.axis ? "DO:drawAxis" : ["ERASE", ["grid"]]

    ]})}
  }

  return (<> <CheckBox spec={spec} session={session}/> </>)
}

export default AxisToggle;
