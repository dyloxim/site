import { I_numberInput } from "@IFS/types/UI";
import { I_session } from "@IFS/types/state";
import { useState } from "react";

export default function IFSUINumber({session, spec }: {
  session: I_session,
  spec: I_numberInput,
}) {

  const [val, setVal] = useState<number>(spec.initial);

  return (

    <span style={{ whiteSpace: "nowrap"}}>

      <label htmlFor={spec.key}>{spec.label}:</label>
      &nbsp;
      <input
        style={{width: "100px"}}
        type="number"
        value={val}
        name={spec.key}
        onChange={e => {
          setVal(Number(e.target.value))
          spec.effect(e, session).eval()
        }}/>

    </span>

)}
