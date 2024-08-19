import { I_buttonInput } from "@IFS/types/UI"
import { I_session } from "@IFS/types/state";
import styles from "./inputs.module.css"

export default function IFSUIButton({spec, classes, session}: {
  spec: I_buttonInput,
  classes?: string
  session: I_session
}) {

  return (
    <>
      <button
        className={typeof classes !== 'undefined' ? classes + ` ${styles.input}` : `${styles.input}`}
        id={spec.key}
        onClick={_ => spec.effect(session).eval()}>

        {spec.label}

      </button>
    </>
  )
}
