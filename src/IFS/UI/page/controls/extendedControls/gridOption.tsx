import SessionMutation from "@IFS/execution/sessionMutation";
import CheckBox from "@IFS/UI/components/checkBox";
import { I_checkBox } from "@IFS/types/UI";


const GridOption = () => {

  const spec: I_checkBox = {
    key: "color",
    label: "Toggle Color",
    initial: false,
    effect: s => { return new SessionMutation({ using: s, do: s => {

      // s.settings.display.grid = !s.settings.display.grid;
      return s;

    }, queue: _ => ["DO:normaliseControlPoints"]

    })}
  }

  return (<> <CheckBox spec={spec}/> </>)
}

export default GridOption;
