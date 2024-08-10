import { I_numberInput, I_UIContext } from "@IFS/types/UI";
import { useState } from "react";

export default function IFSUINumber({ ctx, spec }: {
  ctx: I_UIContext,
  spec: I_numberInput,
}) {

  const [val, setVal] = useState<number>(spec.initial);

  return (

  <>

    {spec.label}: &nbsp;

    <input

      style={{width: "100px"}}
      type="number"
      value={val}
      name={spec.key}

      onChange={e => {

        setVal(Number(e.target.value))

        ctx.updateSession(spec.effect(e, ctx.session).result())

      }}
    />
  </>

)}
