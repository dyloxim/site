import { I_checkBox } from "@IFS/types/UI"
import { I_session } from "@IFS/types/state";
import { useState, useContext, useEffect } from "react";
import { SharedUIState } from "@IFS/UI/SharedUIState";



export default function IFSUIButton({session, spec}: {
  session: I_session,
  spec: I_checkBox
}) {

  const {ctx} = useContext(SharedUIState);

  const [val, setVal] = useState<boolean>(spec.initial);

  useEffect(() => {
    setVal(session.state.options.color);
  }, [ctx]);

  return (
    <span style={{ whiteSpace: "nowrap"}}>

      <label htmlFor={spec.key}>{spec.label}:</label>
      &nbsp;
      <input
        name={spec.key}
        type="checkbox"
        onChange={_ => {
          setVal(!val);
          spec.effect(session).eval();
        }}
        checked={val}
      />

    </span>
  )
}
