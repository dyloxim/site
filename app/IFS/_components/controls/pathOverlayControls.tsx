import { default as CategoricControl } from "./kinds/categoricControl";

import { I_session } from "@IFS/types/state";
import { I_categoricControlSpecification } from "@IFS/types/interaction";

import * as CommonTickets from "@IFS/resources/tickets";

export default function PathOverlayControls({ session, updateSession }: {
  session: I_session,
  updateSession: (session: I_session) => void
}) {

  const pathControls: I_categoricControlSpecification[] = [
    { key: "noPath", text: 'Hide Path', value: null },
    { key: "showRecentPaths", text: 'Show Last', value: "recent" },
    { key: "persistPaths", text: 'Show All', value: "persist" },
  ].map(option => {
    return {
      key: option.key,
      text: option.text,
      mutation: (s) => {
        s.state.options.path = option.value as null | "recent" | "persist";
        return s;
      },
      ticketsGetter: _ => {
        if (option.value) {
          return []
        } else {
          return [CommonTickets.generateBasicLayerTicket("erase", ["pathOverlay"])]
        }
      }
    }
  });

  return (
    <>
      Path: {pathControls.map(specification => (
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
