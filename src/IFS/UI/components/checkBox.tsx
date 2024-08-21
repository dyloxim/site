import { I_checkBox } from "@IFS/types/UI"
import { useState, useEffect } from "react";
import { I_session } from "@IFS/types/state";
import styles from "./inputs.module.css"


export default function IFSUIButton({spec, session}: {spec: I_checkBox, session: I_session}) {

  const [val, setVal] = useState<boolean>(spec.initial);

  useEffect(() => {
    setVal(session.state.options.color);
  }, [session]);

  return (
    <span style={{ whiteSpace: "nowrap", display: "flex", alignItems: "center"}}>

      <label htmlFor={spec.key}>{spec.label}:</label>
      &nbsp;
      <input
        name={spec.key}
        type="checkbox"
        className={`${styles.input} ${styles.checkbox}`}
        onChange={_ => {
          setVal(!val);
          spec.effect(session).eval()
        }}
        checked={val}
      />

    </span>
  )
}
