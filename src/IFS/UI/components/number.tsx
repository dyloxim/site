import { I_numberInput } from "@IFS/types/UI";
import { useState } from "react";
// import { useContext } from "react";
// import { SharedUIState } from "@IFS/UI/SharedUIState";
import { I_session } from "@IFS/types/state";


export default function IFSUINumber({spec, session}: {spec: I_numberInput, session: I_session}) {

  // const {context, updateContext} = useContext(SharedUIState);
  const [val, setVal] = useState<string>(`${spec.initial.toPrecision(4)}`);

  return (

    <span style={{ whiteSpace: "nowrap"}}>

      {spec.label ? <label htmlFor={spec.key}>{spec.label}:</label> : <></>}
      &nbsp;
      <input
        id={spec.key}
        style={{
          width: "46px",
          backgroundColor: "transparent",
          border: "none",
          color: "white"
        }}
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
