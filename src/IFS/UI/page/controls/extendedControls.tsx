import { default as AxisOption } from "./extendedControls/axisOption";
import { default as GridOption } from "./extendedControls/gridOption";
import { default as AutoCenterOption } from "./extendedControls/autoCenterOption";
import { I_session } from "@IFS/types/state";

const ExtendedControls = ({session}: {session: I_session}) => {
  return (
    <>
      <GridOption session={session}/>
      <AxisOption session={session}/>
      <AutoCenterOption session={session}/>
    </>
  )
}

export default ExtendedControls;
