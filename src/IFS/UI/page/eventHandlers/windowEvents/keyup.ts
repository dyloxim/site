import { default as SessionMutation } from "@IFS/execution/sessionMutation"
import { EventResponseSetup } from "@IFS/types/UI";
import { I_session } from "@IFS/types/state";

const handleKeyUp = (session: I_session, e: KeyboardEvent) => {

  new SessionMutation({ using: session, do: s => {

    s.state.mouse.lastModifiers = {
      shift: e.shiftKey,
      alt: e.altKey,
      ctrl: e.ctrlKey,
      meta: e.metaKey,
      pendingUpdate: true
    };

    return s;

  }}).eval();

}

const setupKeyUpHandler: EventResponseSetup = (_canvas, session, _ctx) => {

  window.onkeyup = (e: KeyboardEvent) => handleKeyUp(session, e);

}

export default setupKeyUpHandler;
