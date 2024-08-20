import { default as SessionMutation } from "@IFS/execution/sessionMutation"
import { EventResponseSetup } from "@IFS/types/UI";

const setupMouseUpHandler: EventResponseSetup = (canvas, session, Ctx) => {

  canvas!.addEventListener('mouseup', (_: MouseEvent): void => {

    new SessionMutation({ using: session, do: s => {

      if (s.state.tacit.mutatingFS) Ctx.setCtx({...Ctx.ctxRef.current, FS: s.settings.FS.transforms });
      s.state.mouse.down = null;
      s.state.tacit.draggingRig = null;
      s.state.tacit.mutatingFS = false;
      s.state.mouse.interactionPrimed = false;
      s.state.inputSelected = null;

      return s;

    }}).eval();
  })

}

export default setupMouseUpHandler;
