import { I_session } from "@IFS/types/state";
import * as Actions from "@IFS/resources/tickets"
import CategoricControl from "./kinds/categoricControl";


export default function ControlPointsToggle({ session, updateSession }: {
  session: I_session,
  updateSession: (session: I_session) => void
}) {
  return (
    <>
      <CategoricControl
        session={session}
        updateSession={updateSession}
        specification={{
          key: "bboxes",
          text: "Show Control Points",
          mutation: s => {
            s.state.options.controlPointsShown = !s.state.options.controlPointsShown;
            s.state.selected = [];
            return s;
          },
          ticketsGetter: _ => [
            Actions.reviewControlPointsConfig, 
            Actions.layerUpdate("erase", ["controlPointsOverlay", "selectionOverlay"])
          ]
        }}
      />
      &nbsp; &nbsp; 
    </>
  )
}
