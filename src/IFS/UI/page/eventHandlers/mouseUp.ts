import { default as SessionMutation } from "@IFS/execution/sessionMutation"
import { EventResponseSetup } from "@IFS/types/UI";

const setupMouseUpHandler: EventResponseSetup = (canvas, session, setCtx) => {

  canvas!.addEventListener('mouseup', (_: MouseEvent): void => {

    new SessionMutation({ using: session, do: s => {

      s.state.mouse.down = null;
      s.state.tacit.draggingRig = null;
      s.state.tacit.mutatingFS = false;
      s.state.mouse.interactionPrimed = false;
      s.state.inputSelected = null;
      setCtx({ FS: s.settings.FS.transforms });

      return s;

    }}).eval();

  }, false);

}

export default setupMouseUpHandler;
