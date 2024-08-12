import { I_buttonInput } from "@IFS/types/UI"
import { I_session } from "@IFS/types/state"

export default function IFSUIButton({session, spec, classes}: {
  session: I_session,
  spec: I_buttonInput,
  classes?: string

}) {

  return (
    <>
      <button
        className={typeof classes !== 'undefined' ? classes : ""}
        id={spec.key}
        onClick={_ => spec.effect(session).eval()}>

        {spec.label}

      </button>
    </>
  )
}
