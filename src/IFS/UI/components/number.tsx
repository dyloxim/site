import { I_numberInput } from "@IFS/types/UI";
import { useState } from "react";
import { useContext } from "react";
import { SharedUIState } from "@IFS/UI/SharedUIState";


export default function IFSUINumber({spec}: {spec: I_numberInput}) {

  const {session, updateSession} = useContext(SharedUIState);
  const [val, setVal] = useState<string>(`${spec.initial}`);

  return (

    <span style={{ whiteSpace: "nowrap"}}>

      {spec.label ? <label htmlFor={spec.key}>{spec.label}:</label> : <></>}
      &nbsp;
      <input
        id={spec.key}
        style={{
          width: "42px",
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
          updateSession({...spec.effect(e, session).eval()});
        }}/>

    </span>

)}
