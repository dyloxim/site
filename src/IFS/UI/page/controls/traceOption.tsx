import SessionMutation from "@IFS/execution/sessionMutation";
import CheckBox from "@IFS/UI/components/checkBox";
import { I_checkBox } from "@IFS/types/UI";
import { useState } from "react";
// import { SharedUIState } from "@IFS/UI/SharedUIState";
import { I_session } from "@IFS/types/state";


const TraceToggle = ({session}: {session: I_session}) => {

  // const {context} = useContext(SharedUIState);

  const [val, setVal] = useState<boolean>(session.state.options.trace);

  const spec: I_checkBox = {
    key: "trace",
    label: "Trace",
    initial: val,
    effect: s => { return new SessionMutation({ using: s, do: s => {

      s.state.options.trace = !s.state.options.trace;
      setVal(!s.state.options.trace);
      return s;

    }, queue: _ => [

      "REVIEW:controlPoints",
      ["ERASE", ["figure", "pathOverlay", "controlPointsOverlay"]]

      ]})}
  }

  return (<> <CheckBox spec={spec} session={session}/> </>)
}

export default TraceToggle;
