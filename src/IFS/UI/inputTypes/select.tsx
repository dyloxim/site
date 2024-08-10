import { FunctionSystems } from "@IFS/resources/presets/FSPresets";
import { NamedFSPreset } from "@IFS/types/specifications";
import { I_selectInput, I_UIContext } from "@IFS/types/UI";
import { useState } from "react";

const IFSUIRange = ({ctx, spec}: {
  ctx: I_UIContext
  spec: I_selectInput
}) => {

  const [val, setVal] = useState<string>(spec.initial);

  const valueGetter = () => {
    const select = (document.getElementById(spec.mainKey) as HTMLSelectElement)
    return select.options[select.selectedIndex].id; 
  }

  return (

  <>

    {spec.mainLabel}: &nbsp;

    <select
      id={spec.mainKey}
      name={spec.mainKey}
      value={val}
      onChange={async _ => {
        let choiceKey = valueGetter();
        let choiceName = FunctionSystems[choiceKey as NamedFSPreset].name
        setVal(choiceName)
        ctx.updateSession(spec.effect(choiceKey, ctx.session).result())
      }}>
      {spec.options.map(option => { return (
        <option id={option.key}>{option.label}</option>
      )})}
    </select>

  </>

)}

export default IFSUIRange;
