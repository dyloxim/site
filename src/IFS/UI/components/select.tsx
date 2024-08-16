import { I_selectInput } from "@IFS/types/UI";
import { useContext, useState } from "react";
import { SharedUIState } from "@IFS/UI/SharedUIState";


export default function IFSUISelect({spec}: {spec: I_selectInput}) {

  const {session, updateSession} = useContext(SharedUIState);
  const [choice, setChoice] = useState<string>(spec.initial)

  const valueGetter = () => {
    const select = (document.getElementById(spec.key) as HTMLSelectElement)
    return select.options[select.selectedIndex].id; 
  }

  return (

    <span style={{ whiteSpace: "nowrap"}}>

      <label htmlFor={spec.key}>{spec.label}:</label>
      &nbsp;
      <select
        id={spec.key}
        name={spec.key}
        value={choice}
        onChange={_ => {
          let choiceKey = valueGetter();
          let option = spec.options.filter(a => a.key == choiceKey)[0];
          setChoice(option.label);
        }}>
        {spec.options.map(option => { return (
          <option id={option.key} key={option.key}>{option.label}</option>
        )})}
      </select>

    </span>

)}
