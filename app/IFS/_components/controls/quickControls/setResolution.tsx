import { default as Range } from "@IFS/UI/inputTypes/range";
import { I_rangeInput, I_UIContext } from "@IFS/types/UI";
import SessionMutation from "@IFS/execution/sessionMutation";

const ResolutionControl = ({ctx}: {ctx: I_UIContext}) => {


  const [min, max] = [.1, window.devicePixelRatio]

  const ease = (input: number): number => {

    return Math.pow(input/max, 2) * max;

  }

  const spec: I_rangeInput = {

    key: "resolutionControl",
    label: "Resolution",
    initial: ctx.session.settings.display.rendering.upscaleFactor,
    min: min, max: max,
    steps: 256,
    effect: (e, s) => { return new SessionMutation({ using: s, do: s => {

      const input = Number(e.target.value);
      s.settings.display.rendering.upscaleFactor = ease(input);
      return s;

    }, queue: _ => [

      "REBUILD:rig",
      "REVIEW:controlPoints"

    ]})}}

  return (<> <Range ctx={ctx} spec={spec}/> </>)

}

export default ResolutionControl;
