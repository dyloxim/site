import Zoom from "./navControls/zoom"
import Pan from "./navControls/pan"
import { I_UIContext } from "@IFS/types/UI"

const NavControls = ({ctx}: {ctx: I_UIContext}) => {
  return (
    <>
      <Zoom ctx={ctx}/>
      <Pan ctx={ctx}/>
    </> 
  )
}

export default NavControls;
