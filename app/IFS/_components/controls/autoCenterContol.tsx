import { I_session } from "@IFS/types/state";
import * as Actions from "@IFS/resources/tickets"
import CategoricControl from "./kinds/categoricControl";

export default function AutoCenterControl({ session, updateSession }: {
  session: I_session,
  updateSession: (session: I_session) => void
}) {

  return (
    <>
      <CategoricControl
        session={session}
        updateSession={updateSession}
        specification={{
          key: "normaliseControlPoints",
          text: "Normalise Control Points",
          mutation: s => s,
          ticketsGetter: _ => [Actions.normaliseControlPoints]
        }}
      />
    </>
  )
}
