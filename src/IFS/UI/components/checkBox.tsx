import { I_checkBox } from "@IFS/types/UI"
import { useState, useContext, useEffect } from "react";
import { SharedUIState } from "@IFS/UI/SharedUIState";


export default function IFSUIButton({spec}: {spec: I_checkBox}) {

  const {session, updateSession} = useContext(SharedUIState);
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
          updateSession({...spec.effect(session).eval()});
        }}
        checked={val}
      />

    </span>
  )
}
