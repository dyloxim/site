import { I_session } from "@IFS/types/state";
import { I_numericControlSpecification } from "@IFS/types/interaction";
import SessionMutation from "@IFS/execution/sessionMutation";

export default function ContinuousControl({ session, updateSession, specification }: {
  session: I_session,
  updateSession: (session: I_session) => void
  specification: I_numericControlSpecification,
}) {
  return (
    <>
      {specification.text}: &nbsp;
      <input
        style={{width: "100px"}}
        type="number"
        value={specification.value}
        name={specification.key}
        onChange={(e) => {
          specification.setter(Number(e.target.value))
          updateSession(
            new SessionMutation({
              session: session,
              assertion: specification.mutation(e),
              ticketsGetter: specification.ticketsGetter
            }).gives()
          )
        }}/>
    </>
  )
}
