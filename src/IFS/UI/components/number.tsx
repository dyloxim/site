import { I_numberInput } from "@IFS/types/UI";
import { I_session } from "@IFS/types/state";
import { useState } from "react";
// import { useContext } from "react";
// import { SharedUIState } from "@IFS/UI/SharedUIState";




export default function IFSUINumber({session, spec}: {
  session: I_session,
  spec: I_numberInput,
}) {

  //const {ctx, setCtx} = useContext(SharedUIState);

  const [val, setVal] = useState<number>(spec.initial);

  return (

    <span style={{ whiteSpace: "nowrap"}}>

      {spec.label ? <label htmlFor={spec.key}>{spec.label}:</label> : <></>}
      &nbsp;
      <input
        id={spec.key}
        style={{
          width: "50px",
          backgroundColor: "transparent",
          border: "none",
          color: "white"
        }}
        step={0.05}
        type="number"
        value={val.toPrecision(4)}
        name={spec.key}
        onChange={e => {
          setVal(Number(e.target.value))
          spec.effect(e, session).eval()
        }}/>

    </span>

)}
