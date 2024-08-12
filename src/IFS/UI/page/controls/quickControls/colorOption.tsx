import SessionMutation from "@IFS/execution/sessionMutation";
import CheckBox from "@IFS/UI/components/checkBox";
import { I_checkBox } from "@IFS/types/UI";
import { I_session } from "@IFS/types/state";


const ColorToggle = ({session}: {session: I_session}) => {


  const spec: I_checkBox = {
    key: "color",
    label: "Color",
    initial: session.settings.display.color.multi,
    effect: s => { return new SessionMutation({ using: s, do: s => {

      s.state.options.color = !s.state.options.color;
      return s;

    }, queue: _ => [

      "REVIEW:controlPoints",
      ["ERASE", ["figure", "pathOverlay", "controlPointsOverlay"]]

      ]})}
  }

  return (<> <CheckBox session={session} spec={spec}/> </>)
}

export default ColorToggle;
