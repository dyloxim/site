import { I_session } from "@IFS/types/state";
import * as Actions from "@IFS/resources/tickets"
import CategoricControl from "./kinds/categoricControl";


export default function ColorToggle(

  { session, updateSession }: {

  session: I_session,

  updateSession: (session: I_session) => void

}) {
  return (
    <>
      <CategoricControl
        session={session}
        updateSession={updateSession}
        specification={{
          key: "color",
          text: "Toggle Color",
          mutation: s => { s.state.options.color = !s.state.options.color; return s; },
          ticketsGetter: _ => [
            Actions.reviewControlPointsConfig,
            Actions.layerUpdate(
              "erase", ["figure", "pathOverlay", "controlPointsOverlay"]
            )
          ]
        }}
      /> &nbsp;
    </>
  )
}
