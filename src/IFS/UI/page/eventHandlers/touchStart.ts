import { default as SessionMutation } from "@IFS/execution/sessionMutation"
import { EventResponseSetup } from "@IFS/types/UI";

const setupTouchStartHandler: EventResponseSetup = (canvas, session, Ctx) => {

  canvas!.addEventListener('touchstart', (e: TouchEvent): void => {

    e.preventDefault(); e.stopPropagation()

    if (e.touches.length > 1) { // if multiple touches (pinch zooming)

      new SessionMutation({ using: session, do: s => {

        let diffX = e.touches[0].clientX - e.touches[1].clientX;
        let diffY = e.touches[0].clientY - e.touches[1].clientY;
        let touchDist = Math.sqrt(diffX * diffX + diffY * diffY);
        s.state.mouse.touchDist = touchDist;
        s.state.mouse.displayRescaleInitialRadius! = s.settings.display.domain.displayRadius;
        return s;

      }}).eval();

    } else {

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
    
  }, false);

  // document.body.addEventListener("touchstart", function (e) {
  //   if (e.target == canvas!) {
  //     e.preventDefault();
  //   }
  // }, false);
}

export default setupTouchStartHandler;
// Set up touch events for mobile, etc


