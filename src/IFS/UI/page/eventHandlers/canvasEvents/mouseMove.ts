import { default as SessionMutation } from "@IFS/execution/sessionMutation"
import { EventResponseSetup } from "@IFS/types/UI";
import { I_session } from "@IFS/types/state";
import { QueueItem } from "@IFS/types/tickets";

const handleMouseMove = (canvas: HTMLCanvasElement, session: I_session, e: MouseEvent) => {

  new SessionMutation({ using: session, do: s => {

    if (s.state.tacit.mutatingFS) {
      s.state.tacit.draggingRig = null;
    } else if (s.state.tacit.draggingRig) {
      s.state.tacit.mutatingFS = false;
    }

    let rect = canvas.getBoundingClientRect();
    s.state.mouse.pos = [
      (e.clientX - rect.left) / (rect.right - rect.left) * canvas.width,
      (e.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
    ]
    return s;

  }, queue: s => {

    let queue: QueueItem[] = ["HANDLE:mouseMoveEvent"];
    if (s.state.tacit.mutatingFS) queue = [...queue, "DO:showHoverTarget"]
    if (s.state.mouse.down && s.state.tacit.draggingRig) queue = [...queue,
      "RELOAD:rig",
      ["ERASE", ["figure", "controlPointsOverlay", "selectionOverlay", "pathOverlay"]]
    ];
    if (s.state.options.axis) queue = [...queue, "DO:drawAxis"]
    return queue;

  }}).eval();

}

const setupMouseMoveHandler: EventResponseSetup = (canvas, session, _) => {

  canvas.onmousemove = (e: MouseEvent) => handleMouseMove(canvas, session, e);

}


export default setupMouseMoveHandler;
