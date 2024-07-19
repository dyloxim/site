import { I_session } from "@IFS/types/state";
import { I_categoricControlSpecification } from "@IFS/types/interaction";
import { NamedFSPreset } from "@IFS/types/specifications";
import { NamedFSPresets } from "@IFS/resources/globalConstants";
import { FunctionSystems } from "@IFS/resources/presets/FSPresets";
import * as CommonTickets from "@IFS/resources/tickets"
import CategoricControl from "./kinds/categoricControl";

export default function PresetControls({ session, updateSession }: {
  session: I_session,
  updateSession: (session: I_session) => void
}) {

  const presetControls: I_categoricControlSpecification[] = NamedFSPresets.map(presetName => {
    return {
      key: presetName as string,
      text: presetName.match(/[[A-Z][a-z]+/g)!.join(" "),
      mutation: (s) => {
        s.settings.FS = FunctionSystems[presetName as NamedFSPreset]; return s;
      },
      ticketsGetter: _ => [
        CommonTickets.reloadFS,
        CommonTickets.revertRigToInitial,
        CommonTickets.reloadRig,
        CommonTickets.reviewControlPointsConfig
      ]
    }
  })

  return (
    <>
      Load Preset: {presetControls.map(specification => (
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
