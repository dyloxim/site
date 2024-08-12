import { I_rangeInput } from "@IFS/types/UI";
import Range from "@IFS/UI/components/range";
import SessionMutation from "@IFS/execution/sessionMutation";
import { pathDrawThreshold } from "@IFS/resources/globalConstants";
import { I_session } from "@IFS/types/state";

export default function AnimationRate({session}: {session: I_session}) {

  const [min, max] = [0, 100000]

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
      if (eased > pathDrawThreshold ) {
        s.state.options.path = "None";
      }
      return s

    }, queue: _ => [["ERASE", ["figure", "pathOverlay"]]

    ]})
  }
  

  return (<> <Range session={session} spec={spec}/> </>)
}
