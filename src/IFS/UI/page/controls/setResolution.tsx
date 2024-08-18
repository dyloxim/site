import { default as Range } from "@IFS/UI/components/range";
import { I_rangeInput } from "@IFS/types/UI";
import SessionMutation from "@IFS/execution/sessionMutation";
import { useEffect, useState } from "react";
import { useContext } from "react";
import { I_session } from "@IFS/types/state";

const ResolutionControl = ({session}: {session: I_session}) => {

  // const {context} = useContext(SharedUIState)
  const [max, setMax] = useState<number>(1);
  let min = .1

  const ease = (input: number): number => {
    return Math.max(min, Math.pow(input/max, 1.5) * max);
  }


  const onPageLoad = () => {
    setMax(session.settings.display.rendering.devicePixelRatio);
  }

  useEffect(() => {

    if (document.readyState === 'complete') onPageLoad();

    else {

      window.addEventListener('load', onPageLoad, false);
      return () => window.removeEventListener('load', onPageLoad);

    }}, []);

  const spec: I_rangeInput = {

    key: "resolutionControl",
    label: "Resolution",
    initial: session.settings.display.rendering.upscaleFactor,
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

  return (<> <Range spec={spec} session={session}/> </>)

}

export default ResolutionControl;
