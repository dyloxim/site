import { default as Vec } from "@IFS/math/linearAlgebra/vec2";

import { I_categoricControlSpecification } from "@IFS/types/interaction";

import * as Globals from "@IFS/resources/globalConstants";
import * as Actions from "@IFS/resources/tickets";
import { I_session } from "@IFS/types/state";
import CategoricControl from "./kinds/categoricControl";

export default function PanControls({ session, updateSession }: {
  session: I_session,
  updateSession: (session: I_session) => void
}) {
  const panControls: I_categoricControlSpecification[] = [
    { key: "panLeft",  text: "←", value: [-1, 0] },
    { key: "panDown",  text: "↓", value: [0, -1] },
    { key: "panUp",    text: "↑", value: [0, 1] },
    { key: "panRight", text: "→", value: [1, 0] },
  ].map((option): I_categoricControlSpecification => {
    return {
      key: option.key,
      text: option.text,
      mutation: (s) => {
        let newDisplayOrigin = Vec.add(
          s.settings.display.domain.origin,
          Vec.scale(
            option.value,
            Globals.panStepSizeDisplayRatio * s.settings.display.domain.displayRadius
          )
        );
        s.settings.display.domain.origin = newDisplayOrigin;
        return s;
      },
      ticketsGetter: _ => [Actions.reloadRig, Actions.reviewControlPointsConfig]
    }})

  return (
    <>
      Pan: {panControls.map(specification => (
        <CategoricControl
          key={specification.key}
          session={session}
          updateSession={updateSession}
          specification={specification}
        />
      ))}
      &nbsp; &nbsp;
    </>
  )
}
