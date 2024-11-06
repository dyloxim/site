import { default as SessionMutation } from "@IFS/execution/sessionMutation"
import { Ctx, EventResponseSetup } from "@IFS/types/UI";
import { I_session } from "@IFS/types/state";

const handleTouchEnd = (ctx: Ctx, session: I_session, e: TouchEvent) => {

  e.preventDefault(); e.stopPropagation()

  new SessionMutation({ using: session, do: s => {

    if (s.state.tacit.mutatingFS) ctx.set({...ctx.ref.current, FS: s.settings.FS.transforms });
    s.state.mouse.down = null;

    s.state.tacit.draggingRig = null;
    s.state.tacit.mutatingFS = false;
    s.state.tacit.duplicateSelected = false;

    s.state.transformSelected = null;
    s.state.mouse.interactionPrimed = false;
    s.state.inputSelected = null;

    return s;

  }}).eval();

}

const setupTouchEndHandler: EventResponseSetup = (canvas, session, ctx) => {

  canvas.ontouchend = (e: TouchEvent) => handleTouchEnd(ctx, session, e);

}

export default setupTouchEndHandler;
