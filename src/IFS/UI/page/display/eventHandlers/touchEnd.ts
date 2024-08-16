import { default as SessionMutation } from "@IFS/execution/sessionMutation"
import { I_session } from "@IFS/types/state";

const setupTouchEndHandler = (
  canvas: HTMLCanvasElement,
  context: {
    session: I_session,
    updateSession: React.Dispatch<React.SetStateAction<I_session>>
  }
) => {

  canvas!.addEventListener('touchend', (e: TouchEvent): void => {

    e.preventDefault(); e.stopPropagation()

    context.updateSession({...new SessionMutation({ using: context.session, do: s => {

      s.state.mouse.down = null;
      s.state.tacit.draggingRig = null;
      s.state.tacit.mutatingFS = false;
      s.state.mouse.interactionPrimed = false;
      return s;

    }}).eval()});

  }, false);


  // document.body.addEventListener("touchend", function (e) {
  //   if (e.target == canvas) {
  //     e.preventDefault();
  //   }
  // }, false);

}

export default setupTouchEndHandler;

// Prevent scrolling when touching the canvas
