import { default as SessionMutation } from "@IFS/execution/sessionMutation"
import { EventResponseSetup } from "@IFS/types/UI";
import { I_session } from "@IFS/types/state";

const handleMouseDown = (session: I_session, e: MouseEvent) => {

  if (e.ctrlKey) {
    e.preventDefault();
    e.stopPropagation()
  }

  new SessionMutation({ using: session, do: s => {

      s.state.mouse.down = s.state.mouse.pos;
      s.state.mouse.lastModifiers = {
        shift: e.shiftKey,
        alt: e.altKey,
        ctrl: e.ctrlKey,
        meta: e.metaKey,
        pendingUpdate: true
      };
      return s;

    }, queue: _ => [

      "HANDLE:mouseDownEvent"

    ]}).eval();

}

const setupMouseDownHandler: EventResponseSetup = (canvas, session, _) => {

  canvas.onmousedown = (e: MouseEvent) => handleMouseDown(session, e);

}

export default setupMouseDownHandler;
