import { I_numberInput } from "@IFS/types/UI";
import { useState } from "react";
import { I_session } from "@IFS/types/state";
import styles from "./inputs.module.css"


export default function IFSUINumber({spec, session}: {spec: I_numberInput, session: I_session}) {

  const [val, setVal] = useState<string>(`${spec.initial.toPrecision(4)}`);

  return (

    <span style={{ whiteSpace: "nowrap"}}>

      {spec.label ? <label htmlFor={spec.key}>{spec.label}:</label> : <></>}
      &nbsp;
      <input
        id={spec.key}
        className={`${styles.input} ${styles.number}`}
        step={0.05}
        type="number"
        value={val}
        name={spec.key}
        onChange={e => {
          setVal(e.target.value);
          spec.effect(e, session).eval();
        }}/>

    </span>

)}
