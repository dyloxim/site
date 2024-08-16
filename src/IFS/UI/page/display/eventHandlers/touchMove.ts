import { default as SessionMutation } from "@IFS/execution/sessionMutation"
import { I_session } from "@IFS/types/state";
import { QueueItem } from "@IFS/types/tickets";

const setupTouchMoveHandler = (
  canvas: HTMLCanvasElement,
  context: {
    session: I_session,
    updateSession: React.Dispatch<React.SetStateAction<I_session>>
  }
) => {

  canvas!.addEventListener('touchmove', (e: TouchEvent): void => {

    e.preventDefault(); e.stopPropagation()

    if (e.touches.length > 1) { // If pinch-zooming

      context.updateSession({...new SessionMutation({ using: context.session, do: s => {

        let diffX = e.touches[0].clientX - e.touches[1].clientX;
        let diffY = e.touches[0].clientY - e.touches[1].clientY;
        let newTouchDist = Math.sqrt(diffX * diffX + diffY * diffY);
        let touchDiff = newTouchDist - s.state.mouse.touchDist
        let oldRad = s.settings.display.domain.displayRadius;
        let newDisplayRadius = (oldRad - ((touchDiff/3000) * oldRad));
        s.settings.display.domain.displayRadius = newDisplayRadius;
        return s;

      }, queue: _ => [

        "RELOAD:rig"

      ]}).eval()});

    } else {

      context.updateSession({...new SessionMutation({ using: context.session, do: s => {
      
        let rect = canvas.getBoundingClientRect();
        s.state.mouse.pos = [
          (e.touches[0].clientX - rect.left) / (rect.right - rect.left) * canvas.width,
          (e.touches[0].clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
        ]
        return s;

      }, queue: s => {

        let queue: QueueItem[] = ["HANDLE:mouseMoveEvent"];
        if (s.state.tacit.mutatingFS) queue = [...queue, "DO:showHoverTarget"]
        if (s.state.tacit.draggingRig) queue = [...queue, "RELOAD:rig"]
        return queue;

      }}).eval()});
    } 

    }, false);


  // document.body.addEventListener("touchmove", function (e) {
  //   if (e.target == canvas) {
  //     e.preventDefault();
  //   }
  // }, false);

}

export default setupTouchMoveHandler;




