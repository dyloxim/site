import { I_rangeInput } from "@IFS/types/UI";
import { useState } from "react";
import { I_session } from "@IFS/types/state";




export default function IFSUIRange({session, spec}: {
  session: I_session,
  spec: I_rangeInput
}) {

  const [val, setVal] = useState<number>(spec.initial);

  return (

    <span style={{ whiteSpace: "nowrap"}}>

      <label htmlFor={spec.key}>{spec.label}:</label>
      &nbsp;
      <input
        type="range"
        value={val}
        min={spec.min}
        max={spec.max}
        step={(spec.max - spec.min) / spec.steps}
        style={{verticalAlign: "middle"}}
        name={spec.key}
        onChange={(e) => {
          setVal(Number(e.target.value))
          spec.effect(e, session).eval()
        }}/>

    </span>

)}
