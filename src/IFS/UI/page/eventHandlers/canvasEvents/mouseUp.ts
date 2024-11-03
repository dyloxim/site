import { default as SessionMutation } from "@IFS/execution/sessionMutation"
import { Ctx, EventResponseSetup } from "@IFS/types/UI";
import { I_session } from "@IFS/types/state";

const handleMouseUp = (ctx: Ctx, session: I_session) => {

  new SessionMutation({ using: session, do: s => {

    if (s.state.tacit.mutatingFS) ctx.set({...ctx.ref.current, FS: s.settings.FS.transforms });

    s.state.tacit.draggingRig = null;
    s.state.tacit.mutatingFS = false;
    s.state.basisSelected = null;

    s.state.mouse.down = null;
    s.state.mouse.interactionPrimed = false;
    s.state.mouse.lastModifiers = {
      shift: false,
      alt: false,
      ctrl: false,
      meta: false
    }

    s.state.inputSelected = null;

    return s;

  }}).eval();

}

const setupMouseUpHandler: EventResponseSetup = (canvas, session, ctx) => {

  canvas.onmouseup = (_: MouseEvent) => handleMouseUp(ctx, session);

}

export default setupMouseUpHandler;
