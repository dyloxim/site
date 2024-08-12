import { I_checkBox } from "@IFS/types/UI"
import { I_session } from "@IFS/types/state";
import { useState } from "react";

export default function IFSUIButton({session, spec}: {
  session: I_session,
  spec: I_checkBox
}) {

  const [val, setVal] = useState<boolean>(spec.initial);

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
