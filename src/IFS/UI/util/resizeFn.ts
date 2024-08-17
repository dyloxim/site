import deviceIsMobileOrTablet from '@IFS/UI/util/deviceIsMobileOrTablet'
import calibrateContainer from '@IFS/UI/util/calibrateContainer'
import { default as SessionMutation } from "@IFS/execution/sessionMutation";
import { I_session } from '@IFS/types/state';

const resizeFn = (container: HTMLDivElement, session: I_session) => {

  if (!deviceIsMobileOrTablet()) {

    calibrateContainer(container)
    new SessionMutation({ using: session, queue: _ => [
      "DO:calibrateDisplay",
      "RELOAD:rig"
    ]}).eval()

  }
}

export default resizeFn;
