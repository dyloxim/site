import { default as SessionMutation } from "@IFS/execution/sessionMutation"
import { I_session } from '@IFS/types/state'

const setupMouseUpHandler = (
  canvas: HTMLCanvasElement,
  session: I_session,
) => {

    canvas!.addEventListener('mouseup', (_: MouseEvent): void => {

      new SessionMutation({ using: session, do: s => {

        s.state.mouse.down = null;
        s.state.tacit.draggingRig = null;
        s.state.tacit.mutatingFS = false;
        s.state.mouse.interactionPrimed = false;

        return s;

      }}).eval();

    }, false);

}

export default setupMouseUpHandler;
