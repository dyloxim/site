import { default as CategoricControl } from "./kinds/categoricControl";

import { I_session } from "@IFS/types/state";
import { I_categoricControlSpecification } from "@IFS/types/interaction";

import * as Globals from "@IFS/resources/globalConstants";
import * as CommonTickets from "@IFS/resources/tickets";

export default function ZoomControl({ session, updateSession }: {
  session: I_session,
  updateSession: (session: I_session) => void
}) {

  const zoomControls: I_categoricControlSpecification[] = [
    { identifier: '+', value: Globals.zoomIncrementStep },
    { identifier: '-', value: 1 / Globals.zoomIncrementStep }
  ].map((option): I_categoricControlSpecification => {
    return {
      key: option.identifier == '+' ? 'viewTowards' : 'viewAway',
      text: option.identifier,
      mutation: (s) => {
        let newDisplayRadius = s.settings.display.domain.displayRadius * option.value;
        s.settings.display.domain.displayRadius = newDisplayRadius;
        return s;
      },
      ticketsGetter: _ => [CommonTickets.reloadRig, CommonTickets.reviewControlPointsConfig]
    }
  })

  return (
    <>
      Zoom: {zoomControls.map(specification => (
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
