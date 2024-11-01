import { I_rangeInput } from "@IFS/types/UI";
import Range from "@IFS/UI/components/range";
import SessionMutation from "@IFS/execution/sessionMutation";
import { pathDrawThreshold } from "@IFS/resources/globalConstants";
import { I_session } from "@IFS/types/state";
import { useContext, useState } from "react";
import { Ctx } from "@IFS/UI/SharedUIState";


const AnimationRate = ({session}: {session: I_session}) => {

  const {ctx, setCtx} = useContext(Ctx)
  const [min, max] = [1, 200000]

  let easeFactor = 5;

  const constrain = (x: number): number => {
    return Math.round(Math.max(min, Math.min(max, x)));
  }

  const ease = (x: number): number => {
    return constrain(max*Math.pow(x/max, easeFactor));
  }

  const inverseEase = (x: number): number => {
    return constrain(max*Math.pow(x/max, 1/easeFactor));
  }

  const [value, setValue] = useState<number>(inverseEase(session.state.options.animationRate));

  const spec: I_rangeInput = {
    key: "animationRate",
    label: "Step Rate",
    initial: value,
    min: min, max: max,
    steps: 512,
    effect: (e, s) => new SessionMutation({ using: s, do: s => {

      const newVal = ease(Number(e.target.value));

      setValue(newVal);
      s.state.options.animationRate = newVal;

      if (newVal > pathDrawThreshold && ctx.pathDisabled == false) {
        s.state.options.path = "None";
        setCtx({...ctx, path: "None", pathDisabled: true});
      }

      if (newVal <= pathDrawThreshold && ctx.pathDisabled == true) {
        s.state.options.path = "None";
        setCtx({...ctx, pathDisabled: false});
      }

      return s

    }, queue: _ => [["ERASE", ["figure", "pathOverlay"]]

    ]})
  }
  

  return (<> <Range spec={spec} session={session}/> </>)
}

export default AnimationRate;
