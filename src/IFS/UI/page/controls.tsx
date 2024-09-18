import { default as PresetSelect } from "./controls/presetSelect"
import { default as SetStepRate } from "./controls/setStepRate"
import { default as SetResolution } from "./controls/setResolution"
import { default as StartStop } from "./controls/startStop"
import { default as PathOverlayOption } from "./controls/pathOverlayOption"
import { default as ColorOption } from "./controls/colorOption"
import { I_session } from "@IFS/types/state"

const Controls = ({session}: {session: I_session}) => {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      paddingLeft: ".5em",
      marginTop: "-.2em",
      gap: ".5em",
      marginBotton: "5em",
    }}>

      <div style={{display: "flex", flexDirection: "row", flexWrap: "wrap", marginBottom: "-.5em"}}>
        <div style={{display: "flex", flexDirection: "row", flexWrap: "wrap", padding: ".5em", gap: ".5em"}}>
          <StartStop session={session}/>&nbsp;
          <PresetSelect session={session}/>&nbsp;
        </div>
        <div style={{display: "flex", flexDirection: "row", flexWrap: "wrap", padding: ".5em", gap: ".5em"}}>
          <PathOverlayOption session={session}/>&nbsp;
          <ColorOption session={session}/>&nbsp;
        </div>
      </div>
      <div style={{display: "flex", flexDirection: "row", flexWrap: "wrap", gap: ".5em"}}>
        <div style={{display: "flex", flexDirection: "row", flexWrap: "wrap", padding: ".5em", gap: "1em"}}>
          <SetStepRate session={session}/>
          <SetResolution session={session}/>
        </div>
      </div>
    </div>
  )
}

export default Controls;
