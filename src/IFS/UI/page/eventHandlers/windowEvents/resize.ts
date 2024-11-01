import { default as SessionMutation } from "@IFS/execution/sessionMutation"
import { EventResponseSetup } from "@IFS/types/UI";
import { I_session } from "@IFS/types/state";

const handleResizeEvent = (canvas: HTMLCanvasElement, session: I_session) => {

  let container = canvas.parentNode as HTMLDivElement;

  container.style.width = `${document.body.clientWidth}px`;
  container.style.height = `${window.innerHeight - 132}px`;

  new SessionMutation({ using: session, queue: _ => [
    "DO:calibrateDisplay",
    "RELOAD:rig"
  ]}).eval()

}

const setupResizeHandler: EventResponseSetup = (canvas, session, _) => {

  window.onresize = (_: Event) => handleResizeEvent(canvas, session);

}

export default setupResizeHandler;
