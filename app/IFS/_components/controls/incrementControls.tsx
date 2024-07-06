import { I_session } from "@IFS/types/state";
import { I_categoricControlSpecification } from "@IFS/types/interaction";
import CategoricControl from "./kinds/categoricControl";
import * as Globals from "@IFS/resources/globalConstants";
import * as CommonTickets from "@IFS/resources/tickets";
import { default as Vec } from "@IFS/math/linearAlgebra/vec2";

export default function IncrementControls({ session, updateSession }: {
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
      ticketsGetter: s => {
        let tickets = [CommonTickets.reloadRig]
        tickets = s.state.options.bboxes ? [CommonTickets.reloadBboxes, ...tickets] : tickets;
        return tickets
      }
    }
  })

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
      ticketsGetter: s => {
        let tickets = [CommonTickets.reloadRig]
        tickets = s.state.options.bboxes ? [CommonTickets.reloadBboxes, ...tickets] : tickets;
        return tickets
      }
    }
  })

  const panControls: I_categoricControlSpecification[] = [
    { key: "panLeft",  text: "←", value: [-1, 0] },
    { key: "panDown",  text: "↓", value: [0, -1] },
    { key: "panUp",    text: "↑", value: [0, 1] },
    { key: "panRight", text: "→", value: [1, 0] },
  ].map((option): I_categoricControlSpecification => {
    return {
      key: option.key,
      text: option.text,
      mutation: (s) => {
        let newDisplayOrigin = Vec.add(
          s.settings.display.domain.origin,
          Vec.scale(
            option.value,
            Globals.panStepSizeDisplayRatio * s.settings.display.domain.displayRadius
          )
        );
        s.settings.display.domain.origin = newDisplayOrigin;
        return s;
      },
      ticketsGetter: s => {
        let tickets = [CommonTickets.reloadRig]
        tickets = s.state.options.bboxes ? [CommonTickets.reloadBboxes, ...tickets] : tickets;
        return tickets
      }
    }})

  const pathControls: I_categoricControlSpecification[] = [
    { key: "noPath", text: 'None', value: null },
    { key: "showRecentPaths", text: 'Show Recent', value: "recent" },
    { key: "persistPaths", text: 'Persist', value: "persist" },
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
          return [CommonTickets.generateBasicLayerTicket("layerErase", "pathOverlay", "erase")]
        }
      }
    }
  });

  return (
    <>
      Zoom: {zoomControls.map(specification => (
        <CategoricControl
          key={specification.key}
          session={session}
          updateSession={updateSession}
          specification={specification}
        />
      ))} &nbsp;
      Resolution: {resolutionControls.map(specification => (
        <CategoricControl
          key={specification.key}
          session={session}
          updateSession={updateSession}
          specification={specification}
        />
      ))} &nbsp;
      Pan: {panControls.map(specification => (
        <CategoricControl
          key={specification.key}
          session={session}
          updateSession={updateSession}
          specification={specification}
        />
      ))}
      <br/><br/>
      Path Controls: {pathControls.map(specification => (
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
