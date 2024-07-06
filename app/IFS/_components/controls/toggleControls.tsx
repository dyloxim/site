import { I_session } from "@IFS/types/state";
import { I_categoricControlSpecification } from "@IFS/types/interaction";
import * as CommonTickets from "@IFS/resources/tickets"
import CategoricControl from "./kinds/categoricControl";
import { DefinedTicket } from "@IFS/types/tickets";


export default function IncrementControls({ session, updateSession }: {
  session: I_session,
  updateSession: (session: I_session) => void
}) {
  const togglableControls: I_categoricControlSpecification[] = [
    {
      key: "running",
      text: "Stop / Start",
      mutation: s => { s.state.options.running = !s.state.options.running; return s; },
      ticketsGetter: _ => [/* none */]
    },
    {
      key: "bboxes",
      text: "Show Bounding Boxes",
      mutation: s => { s.state.options.bboxes = !s.state.options.bboxes; return s; },
      ticketsGetter: s => {
        if (s.state.options.bboxes) {
          return [CommonTickets.reloadBboxes]
        } else {
          return [CommonTickets.generateBasicLayerTicket("layerErase", "bboxesOverlay", "erase")]
        }
      }
    },
    {
      key: "color",
      text: "Use Color",
      mutation: s => { s.settings.display.color.multi = !s.settings.display.color.multi; return s; },
      ticketsGetter: s => {
        let tickets = ([
          CommonTickets.generateBasicLayerTicket("layerErase", "figure", "erase"),
          CommonTickets.generateBasicLayerTicket("layerErase", "pathOverlay", "erase"),
          CommonTickets.generateBasicLayerTicket("layerErase", "bboxesOverlay", "erase"),
        ] as DefinedTicket[])
        tickets = s.state.options.bboxes ? [CommonTickets.reloadBboxes, ...tickets] : tickets;
        return tickets
      }
    }
  ]
  return (
    <>
      Toggles: {togglableControls.map(specification => (
        <CategoricControl
          key={specification.key}
          session={session}
          updateSession={updateSession}
          specification={specification}
        />
      ))}
    </>
  )
}
