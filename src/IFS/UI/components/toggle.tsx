import { useState } from "react";

import { I_toggleInput } from "@IFS/types/UI"
import { I_session } from "@IFS/types/state";

export default function IFSUIToggle({session, spec}: {
  session: I_session,
  spec: I_toggleInput
}) {

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
