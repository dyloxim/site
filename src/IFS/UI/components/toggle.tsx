import { useState, useContext } from "react";
import { I_toggleInput } from "@IFS/types/UI"
// import { SharedUIState } from "@IFS/UI/SharedUIState";
import { I_session } from "@IFS/types/state";

export default function IFSUIToggle({spec, session}: {spec: I_toggleInput, session: I_session}) {

  // const {context, updateContext} = useContext(SharedUIState);
  const [val, setVal] = useState<boolean>(spec.initial);

  return (

    <span style={{ whiteSpace: "nowrap"}}>
      <label htmlFor={spec.key}>{spec.mainLabel}</label>
      &nbsp;
      <button
        name={spec.key}
        onClick={_ => {
          setVal(!val);
          spec.effect(session).eval();
        }}>

        {val ? spec.onLabel : spec.offLabel}

      </button>
    </span>
  )
}
