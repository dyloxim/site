import { useState, useContext } from "react";
import { I_toggleInput } from "@IFS/types/UI"
import { SharedUIState } from "@IFS/UI/SharedUIState";

export default function IFSUIToggle({spec}: {spec: I_toggleInput}) {

  const {session, updateSession} = useContext(SharedUIState);
  const [val, setVal] = useState<boolean>(spec.initial);

  return (

    <span style={{ whiteSpace: "nowrap"}}>
      <label htmlFor={spec.key}>{spec.mainLabel}</label>
      &nbsp;
        <button
        name={spec.key}
        onClick={_ => {
        setVal(!val);
          updateSession({...spec.effect(session).eval()});
      }}>

        {val ? spec.onLabel : spec.offLabel}

      </button>
    </span>
  )
}
