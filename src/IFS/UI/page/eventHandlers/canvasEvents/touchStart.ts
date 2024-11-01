import { default as SessionMutation } from "@IFS/execution/sessionMutation"
import { EventResponseSetup } from "@IFS/types/UI";
import { I_session } from "@IFS/types/state";

const handleMultipleTouchStart = (session: I_session, e: TouchEvent) => {

  new SessionMutation({ using: session, do: s => {

    let diffX = e.touches[0].clientX - e.touches[1].clientX;
    let diffY = e.touches[0].clientY - e.touches[1].clientY;
    let touchDist = Math.sqrt(diffX * diffX + diffY * diffY);
    s.state.mouse.touchDist = touchDist;
    s.state.mouse.displayRescaleInitialRadius! = s.settings.display.domain.displayRadius;
    return s;

  }}).eval();

}

const handleSingleTouchStart = (canvas: HTMLCanvasElement, session: I_session, e: TouchEvent) => {

  new SessionMutation({ using: session, do: s => {

    let rect = canvas.getBoundingClientRect();
    s.state.mouse.pos = [
      (e.touches[0].clientX - rect.left) / (rect.right - rect.left) * canvas.width,
      (e.touches[0].clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
    ]
    s.state.mouse.down = s.state.mouse.pos;
    return s;

  }, queue: _ => [

    "HANDLE:mouseDownEvent"

  ]}).eval();

}
  
const handleTouchStart = (canvas: HTMLCanvasElement, session: I_session, e: TouchEvent) => {

  e.preventDefault(); e.stopPropagation()

  if (e.touches.length > 1) {

    handleMultipleTouchStart(session, e);

  } else {

    handleSingleTouchStart(canvas, session, e);

  }
}

const setupTouchStartHandler: EventResponseSetup = (target, session, _) => {

  let canvas = target as HTMLCanvasElement;

  canvas.ontouchstart = (e: TouchEvent) => handleTouchStart(canvas, session, e);


}

export default setupTouchStartHandler;
