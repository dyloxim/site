import { I_buttonInput } from "@IFS/types/UI"
import { I_UIContext } from "@IFS/types/UI";

export default function IFSUIButton({ctx, spec}: {
  ctx: I_UIContext
  spec: I_buttonInput,
}) {
  return (
    <>
      <button
        id={spec.key}
        onClick={_ => {

          ctx.updateSession(spec.effect(ctx.session).result())}}>

        {spec.label}

      </button>
    </>
  )
}
