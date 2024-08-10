import { I_UIContext } from "@IFS/types/UI"
import { default as AxisOption } from "./extendedControls/axisOption";
import { default as GridOption } from "./extendedControls/gridOption";
import { default as AutoCenterOption } from "./extendedControls/autoCenterOption";

const ExtendedControls = ({ctx}: {ctx: I_UIContext}) => {
  return (
    <>
      <GridOption ctx={ctx}/>
      <AxisOption ctx={ctx}/>
      <AutoCenterOption ctx={ctx}/>
    </>
  )
}

export default ExtendedControls;
