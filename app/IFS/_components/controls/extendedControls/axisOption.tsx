import * as Actions from "@IFS/resources/tickets"
import SessionMutation from "@IFS/execution/sessionMutation";
import CheckBox from "@IFS/UI/inputTypes/checkBox";
import { I_UIContext, I_checkBox } from "@IFS/types/UI";


const AxisOption = ({ctx}: {ctx: I_UIContext}) => {

  const spec: I_checkBox = {
    key: "color",
    label: "Toggle Color",
    initial: ctx.session.settings.display.color.multi,
    effect: s => { return new SessionMutation({ using: s, do: s => {

      // s.settings.display.axis = !s.settings.display.axis;
      return s;

    }, queue: _ => ["DO:normaliseControlPoints"]

    })}
  }

  return (<> <CheckBox ctx={ctx} spec={spec}/> </>)
}

export default AxisOption;
