import { I_checkBox } from "@IFS/types/UI"
import { I_UIContext } from "@IFS/types/UI";
import { useState } from "react";

export default function IFSUIButton({ctx, spec}: {
  ctx: I_UIContext
  spec: I_checkBox,
}) {

  const [val, setVal] = useState<boolean>(spec.initial);

  return (
    <>
      <label htmlFor={spec.key}>{spec.label}</label>
      &nbsp;
      <input
        name={spec.key}
        type="checkbox"
        onClick={_ => {
          setVal(!val);
          ctx.updateSession(spec.effect(ctx.session).result())
        }}
        checked={val}
      />
    </>
  )
}
