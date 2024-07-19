import { I_session } from "@IFS/types/state";
import CategoricControl from "./kinds/categoricControl";


export default function StartStopControl({ session, updateSession }: {
  session: I_session,
  updateSession: (session: I_session) => void
}) { return (
    <>
      <CategoricControl
        session={session}
        updateSession={updateSession}
        specification={{
          key: "running",
          text: "▶ / ■",
          mutation: s => { s.state.options.running = !s.state.options.running; return s; },
          ticketsGetter: _ => [/* none */]
        }}
      /> &nbsp; 
    </>
  )
}
