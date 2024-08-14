
import { default as SessionMutation } from "@IFS/execution/sessionMutation"
import { I_session } from '@IFS/types/state'
import { QueueItem } from "@IFS/types/tickets";
import { I_transform } from "@IFS/types/mathematical";

const setupMouseMoveHandler = (
  canvas: HTMLCanvasElement,
  session: I_session,
  setFS: (FS: I_transform[]) =>void
) => {

  canvas.addEventListener('mousemove', (e: MouseEvent) => {

    new SessionMutation({ using: session, do: s => {

      let rect = canvas.getBoundingClientRect();
      s.state.mouse.pos = [
        (e.clientX - rect.left) / (rect.right - rect.left) * canvas.width,
        (e.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
      ]
      // if (s.state.tacit.mutatingFS) {
      //   s.state.tacit.pendingRerender = true;
      //   setFS(s.settings.FS.transforms);
      // }
      return s;

    }, queue: s => {

      let queue: QueueItem[] = ["HANDLE:mouseMoveEvent"];
      if (s.state.tacit.mutatingFS) queue = [...queue, "DO:showHoverTarget"]
      if (s.state.tacit.draggingRig) queue = [...queue, "RELOAD:rig"]
      return queue;

    }}).eval();

  }, false);
}

export default setupMouseMoveHandler;
