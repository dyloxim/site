import { I_rangeInput } from "@IFS/types/UI";
import Range from "@IFS/UI/inputTypes/range";
import SessionMutation from "@IFS/execution/sessionMutation";
import { I_UIContext } from "@IFS/types/UI";

export default function AnimationRate({ctx}: {ctx: I_UIContext}) {

  const [min, max] = [0, 500000]

  const ease = (input: number): number => {

    return Math.max(1, Math.pow(input/max, 4) * max);

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
      return s

    }, queue: _ => [["ERASE", ["figure", "pathOverlay"]]

    ]})
  }
  

  return (<> <Range ctx={ctx} spec={spec}/> </>)
}
