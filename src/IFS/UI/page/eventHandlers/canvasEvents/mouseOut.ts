import { default as SessionMutation } from "@IFS/execution/sessionMutation"
import { EventResponseSetup } from "@IFS/types/UI";
import { I_session } from "@IFS/types/state";

const handleMouseOut = (session: I_session, e: Event) => {
  new SessionMutation({ using: session, do: s => s,
    queue: _ => ["HANDLE:mouseOutEvent"]
  }).eval();
}

const setupMouseOutHandler: EventResponseSetup = (canvas, session, _) => {

  canvas.onmouseout = (e: MouseEvent) => handleMouseOut(session, e);
}

export default setupMouseOutHandler;
