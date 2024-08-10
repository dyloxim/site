import { default as Vec } from "@IFS/math/linearAlgebra/vec2";

import { default as Button } from "@IFS/UI/inputTypes/button";
import { I_UIContext, I_buttonInput } from "@IFS/types/UI"

import * as Globals from "@IFS/resources/globalConstants";

import { default as SessionMutation } from "@IFS/execution/sessionMutation";

export default function PanControls({ctx}: {ctx: I_UIContext}) {

  const panControls: I_buttonInput[] = [

    { key: "panLeft",  label: "←", value: [-1, 0] },
    { key: "panDown",  label: "↓", value: [0, -1] },
    { key: "panUp",    label: "↑", value: [0, 1] },
    { key: "panRight", label: "→", value: [1, 0] },

  ] .map (option => {

    return { key: option.key, label: option.label,

      effect: s => { return new SessionMutation({ using: s, do: s => {

        let newDisplayOrigin = Vec.add(
          s.settings.display.domain.origin,
          Vec.scale(
            option.value,
            Globals.panStepSizeDisplayRatio * s.settings.display.domain.displayRadius
          )
        );
        s.settings.display.domain.origin = newDisplayOrigin;
        return s;

      }, queue: _ => ["RELOAD:rig", "REVIEW:controlPoints"]

      })}}});


  return (<>{panControls.map(spec => (<Button spec={spec} ctx={ctx}/>))}</>)

}
