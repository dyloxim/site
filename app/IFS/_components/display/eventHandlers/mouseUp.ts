
import { default as SessionMutation } from "@IFS/execution/sessionMutation"
import { I_session } from '@IFS/types/state'

const setupMouseUpHandler = (
  canvas: HTMLCanvasElement,
  session: I_session,
  setStateFn: React.Dispatch<React.SetStateAction<I_session>>
) => {

    canvas!.addEventListener('mouseup', (_: MouseEvent): void => {

      setStateFn(new SessionMutation({ using: session, do: s => {

        s.state.mouse.down = null;
        s.state.tacit.draggingRig = null;
        s.state.tacit.mutatingFS = false;
        s.state.mouse.interactionPrimed = false;

        return s;

      }}).result());

    }, false);

}

export default setupMouseUpHandler;
