import { default as PresetSelect } from "./controls/presetSelect"
import { default as SetStepRate } from "./controls/setStepRate"
import { default as SetResolution } from "./controls/setResolution"
import { default as StartStop } from "./controls/startStop"
import { default as PathOverlayOption } from "./controls/pathOverlayOption"
import { default as ColorOption } from "./controls/colorOption"
import { I_session } from "@IFS/types/state"

const Controls = ({session}: {session: I_session}) => {
  return (
    <div style={{paddingLeft: ".5em"}}>
      <div style={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        padding: ".5em",
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
        padding: ".5em",
        gap: ".5em"
      }}>
        <div>
          <SetStepRate session={session}/>&nbsp;
          <SetResolution session={session}/>&nbsp;
        </div>
      </div>
    </div>
  )
}

export default Controls;
