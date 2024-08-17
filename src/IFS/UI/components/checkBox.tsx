import { I_checkBox } from "@IFS/types/UI"
import { useState, useContext, useEffect } from "react";
// import { SharedUIState } from "@IFS/UI/SharedUIState";
import { I_session } from "@IFS/types/state";


export default function IFSUIButton({spec, session}: {spec: I_checkBox, session: I_session}) {

  // const {context, updateContext} = useContext(SharedUIState);
  const [val, setVal] = useState<boolean>(spec.initial);

  useEffect(() => {
    setVal(session.state.options.color);
  }, [session]);

  return (
    <span style={{ whiteSpace: "nowrap"}}>

      <label htmlFor={spec.key}>{spec.label}:</label>
      &nbsp;
      <input
        name={spec.key}
        type="checkbox"
        onChange={_ => {
          setVal(!val);
          spec.effect(session).eval()
        }}
        checked={val}
      />

    </span>
  )
}
