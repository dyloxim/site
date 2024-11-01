import { default as SessionMutation } from "@IFS/execution/sessionMutation"
import { EventResponseSetup } from "@IFS/types/UI";
import { I_session } from "@IFS/types/state";
import { QueueItem } from "@IFS/types/tickets";

const handlePinchGesture = (session: I_session, e: TouchEvent) => {

  new SessionMutation({ using: session, do: s => {

    let diffX = e.touches[0].clientX - e.touches[1].clientX;
    let diffY = e.touches[0].clientY - e.touches[1].clientY;
    let newTouchDist = Math.sqrt(diffX * diffX + diffY * diffY);
    let touchDiff = newTouchDist - s.state.mouse.touchDist
    let oldRad = s.state.mouse.displayRescaleInitialRadius!;
    let newDisplayRadius = (oldRad - ((touchDiff/300) * oldRad));
    s.state.inputSelected = null;
    s.settings.display.domain.displayRadius = newDisplayRadius;
    return s;

  }, queue: s => {

    let queue: QueueItem[] = ["HANDLE:mouseMoveEvent"];
    queue = ["RELOAD:rig",
      ["ERASE", ["figure", "pathOverlay", "controlPointsOverlay", "selectionOverlay", "hoverOverlay"]]]

    if (s.state.options.axis) queue = [...queue, "DO:drawAxis"]

    return queue;

  }}).eval();

}

const handleDragGesture = (canvas: HTMLCanvasElement, session: I_session, e: TouchEvent) => {

  new SessionMutation({ using: session, do: s => {
      
    let rect = canvas.getBoundingClientRect();
    s.state.mouse.pos = [
      (e.touches[0].clientX - rect.left) / (rect.right - rect.left) * canvas.width,
      (e.touches[0].clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
    ]
    return s;

  }, queue: s => {

    let queue: QueueItem[] = ["HANDLE:mouseMoveEvent"];

    if (s.state.tacit.mutatingFS) queue = [...queue, "DO:showHoverTarget"]

    if (s.state.tacit.draggingRig) queue = [...queue,
      "RELOAD:rig",
      ["ERASE", ["figure", "pathOverlay", "controlPointsOverlay", "selectionOverlay"]]]

    if (s.state.options.axis) queue = [...queue, "DO:drawAxis"]

    return queue;

  }}).eval();

}

const handleTouchEvent = (canvas: HTMLCanvasElement, session: I_session, e: TouchEvent) => {

  e.preventDefault(); e.stopPropagation();

  if (e.touches.length > 1) {
    handlePinchGesture(session, e);
  } else {
    handleDragGesture(canvas, session, e);
  }
  
}

const setupTouchMoveHandler: EventResponseSetup = (target, session, _) => {

  let canvas = target as HTMLCanvasElement;

  canvas.ontouchmove = (e: TouchEvent) => handleTouchEvent(canvas, session, e);

}

export default setupTouchMoveHandler;

