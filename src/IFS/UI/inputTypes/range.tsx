import { I_rangeInput, I_UIContext } from "@IFS/types/UI";
import { useState } from "react";

export default function IFSUIRange({ctx, spec}: {
  ctx: I_UIContext
  spec: I_rangeInput
}) {

  const [val, setVal] = useState<number>(spec.initial);

  return (

  <>

    {spec.label}: &nbsp;

    <input
      style={{width: "100px"}}
      type="range"
      value={val}
      min={spec.min}
      max={spec.max}
      step={(spec.max - spec.min) / spec.steps}
      name={spec.key}
      onChange={(e) => {
        setVal(Number(e.target.value))
        ctx.updateSession(spec.effect(e, ctx.session).result())
      }}/>

  </>

)}
