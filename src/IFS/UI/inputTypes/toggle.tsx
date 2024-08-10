import { useState } from "react";

import { I_toggleInput } from "@IFS/types/UI"
import { I_UIContext } from "@IFS/types/UI";

export default function IFSUIToggle({ctx, spec}: {
  ctx: I_UIContext
  spec: I_toggleInput,
}) {

  const [val, setVal] = useState<boolean>(spec.initial);

  return (

    <>
      <button onClick={_ => {
        setVal(!val);
        ctx.updateSession(spec.effect(ctx.session).result());
      }}>

        {val ? spec.onLabel : spec.offLabel}

      </button>
    </>
  )
}
