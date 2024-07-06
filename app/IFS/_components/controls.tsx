import { I_session } from "@IFS/types/state"
import IncrementControls from "./controls/incrementControls"
import PresetControls from "./controls/presetControls"
import ToggleControls from "./controls/toggleControls"
import SliderControls from "./controls/sliderControls"

export default function Controls({ session, updateSession }: {
  session: I_session,
  updateSession: (session: I_session) => void
}) {
  return (
    <>
      <SliderControls
        session={session}
        updateSession={updateSession}
      /> <br/>
      <PresetControls
        session={session}
        updateSession={updateSession}
      /> <br/><br/>
      <IncrementControls
        session={session}
        updateSession={updateSession}
      /> <br/><br/>
      <ToggleControls
        session={session}
        updateSession={updateSession}
      />
    </>
  )
}
