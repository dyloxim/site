import { I_selectInput } from "@IFS/types/UI";
import { useContext, useState } from "react";
// import { SharedUIState } from "@IFS/UI/SharedUIState";
import { I_session } from "@IFS/types/state";
import styles from "./inputs.module.css"


export default function IFSUISelect({spec, session}: {spec: I_selectInput, session: I_session}) {

  // const {context, updateContext} = useContext(SharedUIState);
  const [choice, setChoice] = useState<string>(spec.initial)

  const valueGetter = () => {
    const select = (document.getElementById(spec.key) as HTMLSelectElement)
    return select.options[select.selectedIndex].id; 
  }

  return (

    <span style={{ whiteSpace: "nowrap", display: "flex", alignItems: "center"}}>

      <label htmlFor={spec.key}>{spec.label}:</label>
      &nbsp;
      <select
        id={spec.key}
        name={spec.key}
        className={styles.input}
        value={choice}
        onChange={_ => {
          let choiceKey = valueGetter();
          let option = spec.options.filter(a => a.key == choiceKey)[0];
          setChoice(option.label);
          option.effect(session).eval();}}>
        {spec.options.map(option => { return (
          <option id={option.key} key={option.key}>{option.label}</option>
        )})}
      </select>

    </span>

)}
