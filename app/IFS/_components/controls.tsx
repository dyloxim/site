import { I_session } from "@IFS/types/state"
import PresetControls from "./controls/presetControls"
import AnimationRateControl from "./controls/animationRateControl"
import ResolutionControl from "./controls/resolutionControl"
import ZoomControl from "./controls/zoomControl"
import PanControls from "./controls/panControls"
import StartStopControl from "./controls/startStopControl"
import ControlPointsToggle from "./controls/controlPointsToggle"
import PathOverlayControls from "./controls/pathOverlayControls"
import ColorToggle from "./controls/colorToggle"

export default function Controls({ session, updateSession }: {
  session: I_session,
  updateSession: (session: I_session) => void
}) {
  return (
    <>
      <StartStopControl session={session} updateSession={updateSession} />
      <ColorToggle session={session} updateSession={updateSession} />
      <PathOverlayControls session={session} updateSession={updateSession} />
      <AnimationRateControl session={session} updateSession={updateSession} />

      <br/>
      <br/>


      <ControlPointsToggle session={session} updateSession={updateSession} />
      <ZoomControl session={session} updateSession={updateSession} />
      <PanControls session={session} updateSession={updateSession} />
      <ResolutionControl session={session} updateSession={updateSession} />

      <br/>
      <br/>

      <PresetControls session={session} updateSession={updateSession} />

    </>
  )
}
