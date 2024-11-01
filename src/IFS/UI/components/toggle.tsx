import { useEffect, useState } from "react";
import { I_toggleInput } from "@IFS/types/UI"
import { I_session } from "@IFS/types/state";
import styles from "./inputs.module.css"

export default function IFSUIToggle({spec, session}: {
  spec: I_toggleInput,
  session: I_session
}) {

  const [val, setVal] = useState<boolean>(spec.initial);

  return (

    <span style={{ whiteSpace: "nowrap"}}>
      <button
        name={spec.offLabel}
        className={`${styles.input} ${!val ? styles.active : styles.inactive}`}
        onClick={_ => {
          setVal(!val);
          spec.effect(session).eval();
        }}>

        {spec.offLabel}

      </button>
      <button
        name={spec.key}
        className={`${styles.input} ${val ? styles.active : styles.inactive}`}
        onClick={_ => {
          setVal(!val);
          spec.effect(session).eval();
        }}>

        {spec.onLabel}

      </button>
    </span>
  )
}
