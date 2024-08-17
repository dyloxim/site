import { I_rangeInput } from "@IFS/types/UI";
import Range from "@IFS/UI/components/range";
import SessionMutation from "@IFS/execution/sessionMutation";
import { pathDrawThreshold } from "@IFS/resources/globalConstants";
import { I_session } from "@IFS/types/state";
import { useContext } from "react";
import { Ctx } from "@IFS/UI/SharedUIState";


const AnimationRate = ({session}: {session: I_session}) => {

  const {ctx, setCtx} = useContext(Ctx)
  const [min, max] = [1, 200000]

  const ease = (input: number): number => {

    return Math.max(1, Math.pow(input/max, 6) * max);

  }

  const spec: I_rangeInput = {
    key: "animationRate",
    label: "Animation Rate",
    initial: 1,
    min: min, max: max,
    steps: 512,
    effect: (e, s) => new SessionMutation({ using: s, do: s => {

      const input = Number(e.target.value);
      const eased = ease(input);
      s.state.options.animationRate = eased;
      if (eased > pathDrawThreshold && s.state.options.path != "None") {
        s.state.options.path = "None";
        setCtx({...ctx, path: "None"});
      }
      return s

    }, queue: _ => [["ERASE", ["figure", "pathOverlay"]]

    ]})
  }
  

  return (<> <Range spec={spec} session={session}/> </>)
}

export default AnimationRate;
