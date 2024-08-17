import { default as SessionMutation } from "@IFS/execution/sessionMutation"
import { EventResponseSetup } from "@IFS/types/UI";
import { QueueItem } from "@IFS/types/tickets";

const setupMouseMoveHandler: EventResponseSetup = (canvas, session, Ctx) => {

  canvas.addEventListener('mousemove', (e: MouseEvent) => {

    new SessionMutation({ using: session, do: s => {

      let rect = canvas.getBoundingClientRect();
      s.state.mouse.pos = [
        (e.clientX - rect.left) / (rect.right - rect.left) * canvas.width,
        (e.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
      ]
      return s;

    }, queue: s => {

      let queue: QueueItem[] = ["HANDLE:mouseMoveEvent"];
      if (s.state.tacit.mutatingFS) queue = [...queue, "DO:showHoverTarget"]
      if (s.state.tacit.draggingRig) queue = [...queue,
        "RELOAD:rig",
        ["ERASE", ["figure", "controlPointsOverlay", "selectionOverlay"]]]
      return queue;

    }}).eval();

  }, false);
}

export default setupMouseMoveHandler;
