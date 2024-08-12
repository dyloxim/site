import Zoom from "./navControls/zoom"
import Pan from "./navControls/pan"
import { I_session } from "@IFS/types/state"

const NavControls = ({session}: {session: I_session}) => {
  return (
    <>
      <Zoom session={session}/>
      <Pan session={session}/>
    </> 
  )
}

export default NavControls;
