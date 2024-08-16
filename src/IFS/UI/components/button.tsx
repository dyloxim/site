import { I_buttonInput } from "@IFS/types/UI"
import { useContext } from "react";
import { SharedUIState } from "@IFS/UI/SharedUIState";

export default function IFSUIButton({spec, classes}: {
  spec: I_buttonInput,
  classes?: string

}) {

  const {session, updateSession} = useContext(SharedUIState);

  return (
    <>
      <button
        className={typeof classes !== 'undefined' ? classes : ""}
        id={spec.key}
        onClick={_ => updateSession({...spec.effect(session).eval()})}>

        {spec.label}

      </button>
    </>
  )
}
