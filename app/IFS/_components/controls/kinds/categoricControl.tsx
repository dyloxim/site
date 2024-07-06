import { I_session } from "@IFS/types/state";
import { I_categoricControlSpecification } from "@IFS/types/interaction";
import SessionMutation from "@IFS/execution/sessionMutation";

export default function DiscreteControl({ session, updateSession, specification }: {
  session: I_session,
  updateSession: (session: I_session) => void
  specification: I_categoricControlSpecification,
}) {
  return (
    <>
      <button
        onClick={() => {
          updateSession(
            new SessionMutation({
              session: session,
              assertion: specification.mutation,
              ticketsGetter: specification.ticketsGetter
            }).gives()
          )
        }}>
        {specification.text}
      </button>
    </>
  )
}
