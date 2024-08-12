import { default as PresetSelect } from "./quickControls/presetSelect"
import { default as SetStepRate } from "./quickControls/setStepRate"
import { default as SetResolution } from "./quickControls/setResolution"
import { default as StartStop } from "./quickControls/startStop"
import { default as PathOverlayOption } from "./quickControls/pathOverlayOption"
import { default as ColorOption } from "./quickControls/colorOption"
import { I_session } from "@IFS/types/state"

const QuickControls = ({session}: {session: I_session}) => {
  return (
    <>
      <div style={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        gap: ".5em"
      }}>
        <div>
          <StartStop session={session}/>&nbsp;
          <PresetSelect session={session}/>&nbsp;&nbsp;
        </div>
        <div>
          <PathOverlayOption session={session}/>&nbsp;
          <ColorOption session={session}/>&nbsp;
        </div>
      </div>
      <br/>
      <div style={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        gap: ".5em"
      }}>
        <div>
          <SetStepRate session={session}/>&nbsp;
          <SetResolution session={session}/>&nbsp;
        </div>
      </div>
    </>
  )
}

export default QuickControls;
