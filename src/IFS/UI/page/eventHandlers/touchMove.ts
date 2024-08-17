import { default as SessionMutation } from "@IFS/execution/sessionMutation"
import { EventResponseSetup } from "@IFS/types/UI";
import { QueueItem } from "@IFS/types/tickets";

const setupTouchMoveHandler: EventResponseSetup = (canvas, session, Ctx) => {

  canvas!.addEventListener('touchmove', (e: TouchEvent): void => {

    e.preventDefault(); e.stopPropagation()

    if (e.touches.length > 1) { // If pinch-zooming

      new SessionMutation({ using: session, do: s => {

        let diffX = e.touches[0].clientX - e.touches[1].clientX;
        let diffY = e.touches[0].clientY - e.touches[1].clientY;
        let newTouchDist = Math.sqrt(diffX * diffX + diffY * diffY);
        let touchDiff = newTouchDist - s.state.mouse.touchDist
        let oldRad = s.settings.display.domain.displayRadius;
        let newDisplayRadius = (oldRad - ((touchDiff/3000) * oldRad));
        s.state.inputSelected = null;
        s.settings.display.domain.displayRadius = newDisplayRadius;
        return s;

      }, queue: _ => [

        "RELOAD:rig",
        ["ERASE", ["figure", "controlPointsOverlay", "selectionOverlay"]]

      ]}).eval();

    } else {

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
          ["ERASE", ["figure", "controlPointsOverlay", "selectionOverlay"]]]
        return queue;

      }}).eval();
    } 

    }, false);


  // document.body.addEventListener("touchmove", function (e) {
  //   if (e.target == canvas) {
  //     e.preventDefault();
  //   }
  // }, false);

}

export default setupTouchMoveHandler;




