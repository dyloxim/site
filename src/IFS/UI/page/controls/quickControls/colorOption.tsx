import SessionMutation from "@IFS/execution/sessionMutation";
import CheckBox from "@IFS/UI/components/checkBox";
import { I_checkBox } from "@IFS/types/UI";
import { I_session } from "@IFS/types/state";
import { useState, useContext, useEffect } from "react";
import { SharedUIState } from "@IFS/UI/SharedUIState";


const ColorToggle = ({session}: {session: I_session}) => {

  const {ctx} = useContext(SharedUIState);

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

  return (<> <CheckBox session={session} spec={spec}/> </>)
}

export default ColorToggle;
