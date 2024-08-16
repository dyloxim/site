import { default as AxisOption } from "./extendedControls/axisOption";
import { default as GridOption } from "./extendedControls/gridOption";
import { default as AutoCenterOption } from "./extendedControls/autoCenterOption";

const ExtendedControls = () => {
  return (
    <>
      <GridOption/>
      <AxisOption/>
      <AutoCenterOption/>
    </>
  )
}

export default ExtendedControls;
