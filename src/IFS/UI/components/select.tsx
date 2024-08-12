import { FunctionSystems } from "@IFS/resources/presets/FSPresets";
import { NamedFSPreset } from "@IFS/types/specifications";
import { I_session } from "@IFS/types/state";
import { I_selectInput } from "@IFS/types/UI";
import { useState } from "react";


const IFSUISelect = ({session, spec}: {
  session: I_session
  spec: I_selectInput,
}) => {

  const [val, setVal] = useState<string>(spec.initial);

  const valueGetter = () => {
    const select = (document.getElementById(spec.mainKey) as HTMLSelectElement)
    return select.options[select.selectedIndex].id; 
  }

  return (

    <span style={{ whiteSpace: "nowrap"}}>

      <label htmlFor={spec.mainKey}>{spec.mainLabel}:</label>
      &nbsp;
      <select
        id={spec.mainKey}
        name={spec.mainKey}
        value={val}
        onChange={async _ => {
          let choiceKey = valueGetter();
          let choiceName = FunctionSystems[choiceKey as NamedFSPreset].name
          setVal(choiceName)
          spec.effect(choiceKey, session).eval();
        }}>
        {spec.options.map(option => { return (
          <option id={option.key} key={option.key}>{option.label}</option>
        )})}
      </select>

    </span>

)}

export default IFSUISelect;
