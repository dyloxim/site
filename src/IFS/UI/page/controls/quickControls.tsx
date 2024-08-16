import { default as PresetSelect } from "./quickControls/presetSelect"
import { default as SetStepRate } from "./quickControls/setStepRate"
import { default as SetResolution } from "./quickControls/setResolution"
import { default as StartStop } from "./quickControls/startStop"
import { default as PathOverlayOption } from "./quickControls/pathOverlayOption"
import { default as ColorOption } from "./quickControls/colorOption"

const QuickControls = () => {
  return (
    <>
      <div style={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        gap: ".5em"
      }}>
        <div>
          <StartStop/>&nbsp;
          <PresetSelect/>&nbsp;&nbsp;
        </div>
        <div>
          <PathOverlayOption/>&nbsp;
          <ColorOption/>&nbsp;
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
          <SetStepRate/>&nbsp;
          <SetResolution/>&nbsp;
        </div>
      </div>
    </>
  )
}

export default QuickControls;
