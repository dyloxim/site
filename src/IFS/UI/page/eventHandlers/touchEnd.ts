import { default as SessionMutation } from "@IFS/execution/sessionMutation"
import { EventResponseSetup } from "@IFS/types/UI";

const setupTouchEndHandler: EventResponseSetup = (canvas, session, setCtx) => {

  canvas!.addEventListener('touchend', (e: TouchEvent): void => {

    e.preventDefault(); e.stopPropagation()

    new SessionMutation({ using: session, do: s => {

      s.state.mouse.down = null;
      s.state.tacit.draggingRig = null;
      s.state.tacit.mutatingFS = false;
      s.state.mouse.interactionPrimed = false;
      return s;

    }}).eval();

  }, false);


  // document.body.addEventListener("touchend", function (e) {
  //   if (e.target == canvas) {
  //     e.preventDefault();
  //   }
  // }, false);

}

export default setupTouchEndHandler;

// Prevent scrolling when touching the canvas