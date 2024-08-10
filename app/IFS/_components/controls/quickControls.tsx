import { default as PresetSelect } from "./quickControls/presetSelect"
import { default as SetStepRate } from "./quickControls/setStepRate"
import { default as SetResolution } from "./quickControls/setResolution"
import { default as StartStop } from "./quickControls/startStop"
import { default as PathOverlayOption } from "./quickControls/pathOverlayOption"
import { default as ColorOption } from "./quickControls/colorOption"
import { I_UIContext } from "@IFS/types/UI"

const QuickControls = ({ctx}:{ctx: I_UIContext}) => {
  return (
    <>
      <PresetSelect ctx={ctx} />
      <br/>
      <StartStop ctx={ctx}/>
      <ColorOption ctx={ctx}/>
      <SetStepRate ctx={ctx}/>
      <br/>
      <SetResolution ctx={ctx}/>
      <br/>
      <PathOverlayOption ctx={ctx}/>
    </>
  )
}

export default QuickControls;
