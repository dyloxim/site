import { default as CategoricControl } from "./kinds/categoricControl";

import { I_session } from "@IFS/types/state";
import { I_categoricControlSpecification } from "@IFS/types/interaction";

import * as Globals from "@IFS/resources/globalConstants";
import * as Actions from "@IFS/resources/tickets";

export default function ResolutionControl({ session, updateSession }: {
  session: I_session,
  updateSession: (session: I_session) => void
}) {
  const resolutionControls: I_categoricControlSpecification[] = [
    { identifier: '+', value: Globals.resolutionIncrementStep },
    { identifier: '-', value: 1 / Globals.resolutionIncrementStep }
  ].map((option): I_categoricControlSpecification => {
    return {
      key: option.identifier == '+' ? 'resolutionIncrement' : 'resolutionDecrement',
      text: option.identifier,
      mutation: (s) => {
        let newUpscaleFactor = s.settings.display.rendering.upscaleFactor * option.value;
        s.settings.display.rendering.upscaleFactor = newUpscaleFactor;
        return s;
      },
      ticketsGetter: _ => [Actions.reconstructRig, Actions.reviewControlPointsConfig]
    }
  })
  return (
    <>
      Resolution: {resolutionControls.map(specification => (
        <CategoricControl
          key={specification.key}
          session={session}
          updateSession={updateSession}
          specification={specification}
        />
      ))} &nbsp;
    </>
  )
}
