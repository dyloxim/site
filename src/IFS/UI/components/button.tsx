import { I_buttonInput } from "@IFS/types/UI"
import { useContext } from "react";
// import { SharedUIState } from "@IFS/UI/SharedUIState";
import { I_session } from "@IFS/types/state";

export default function IFSUIButton({spec, classes, session}: {
  spec: I_buttonInput,
  classes?: string
  session: I_session
}) {

  // const {context, updateContext} = useContext(SharedUIState);

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
