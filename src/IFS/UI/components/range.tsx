import { I_rangeInput } from "@IFS/types/UI";
import { useState, useContext } from "react";
// import { SharedUIState } from "@IFS/UI/SharedUIState";
import { I_session } from "@IFS/types/state";
import styles from "./inputs.module.css"


export default function IFSUIRange({spec, session}: {spec: I_rangeInput, session: I_session}) {

  // const {context, updateContext} = useContext(SharedUIState);
  const [val, setVal] = useState<number>(spec.initial);

  return (

    <span style={{ whiteSpace: "nowrap", display: "flex", alignItems: "center"}}>

      <label htmlFor={spec.key}>{spec.label}:</label>
      &nbsp;
      <input
        type="range"
        value={val}
        min={spec.min}
        max={spec.max}
        className={`${styles.input} ${styles.range}`}
        step={(spec.max - spec.min) / spec.steps}
        style={{verticalAlign: "middle"}}
        name={spec.key}
        onChange={(e) => {
          setVal(Number(e.target.value))
          spec.effect(e, session).eval();
        }}/>

    </span>

)}
