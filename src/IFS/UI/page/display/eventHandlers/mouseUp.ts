import { default as SessionMutation } from "@IFS/execution/sessionMutation"
import { I_session } from "@IFS/types/state";

const setupMouseUpHandler = (
  canvas: HTMLCanvasElement,
  context: {
    session: I_session,
    updateSession: React.Dispatch<React.SetStateAction<I_session>>
  }
) => {

  canvas!.addEventListener('mouseup', (_: MouseEvent): void => {

    context.updateSession({...new SessionMutation({ using: context.session, do: s => {

      s.state.mouse.down = null;
      s.state.tacit.draggingRig = null;
      s.state.tacit.mutatingFS = false;
      s.state.mouse.interactionPrimed = false;
      s.state.inputSelected = null;

      return s;

    }}).eval()});

  }, false);

}

export default setupMouseUpHandler;
