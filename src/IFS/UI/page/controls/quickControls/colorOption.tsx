import SessionMutation from "@IFS/execution/sessionMutation";
import CheckBox from "@IFS/UI/components/checkBox";
import { I_checkBox } from "@IFS/types/UI";
import { useState, useContext } from "react";
import { SharedUIState } from "@IFS/UI/SharedUIState";


const ColorToggle = () => {

  const {session} = useContext(SharedUIState);

  const [val, setVal] = useState<boolean>(session.state.options.color);

  const spec: I_checkBox = {
    key: "color",
    label: "Color",
    initial: val,
    effect: s => { return new SessionMutation({ using: s, do: s => {

      s.state.options.color = !s.state.options.color;
      setVal(!s.state.options.color);
      return s;

    }, queue: _ => [

      "REVIEW:controlPoints",
      ["ERASE", ["figure", "pathOverlay", "controlPointsOverlay"]]

      ]})}
  }

  return (<> <CheckBox spec={spec}/> </>)
}

export default ColorToggle;
