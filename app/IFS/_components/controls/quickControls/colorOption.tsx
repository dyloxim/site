import SessionMutation from "@IFS/execution/sessionMutation";
import CheckBox from "@IFS/UI/inputTypes/checkBox";
import { I_UIContext, I_checkBox } from "@IFS/types/UI";


const ColorToggle = ({ctx}: {ctx: I_UIContext}) => {

  const spec: I_checkBox = {
    key: "color",
    label: "Color",
    initial: ctx.session.settings.display.color.multi,
    effect: s => { return new SessionMutation({ using: s, do: s => {

      s.state.options.color = !s.state.options.color;
      return s;

    }, queue: _ => [

      "REVIEW:controlPoints",
      ["ERASE", ["figure", "pathOverlay", "controlPointsOverlay"]]

      ]})}
  }

  return (<> <CheckBox ctx={ctx} spec={spec}/> </>)
}

export default ColorToggle;
