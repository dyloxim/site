import { default as SessionMutation } from "@IFS/execution/sessionMutation"
import { EventResponseSetup } from "@IFS/types/UI";
import { I_session } from "@IFS/types/state";
import { QueueItem } from "@IFS/types/tickets";

const handleWheelEvent = (session: I_session, e: WheelEvent) => {

  if (e.deltaY != 0 && e.ctrlKey) {

    e.preventDefault(); e.stopPropagation()

    new SessionMutation({ using: session, do: s => {

      let normalizeFn = (x: number) => - (1/((x/5)+5)) + .2;
      let multiplier = (_ => {
        if (e.deltaY > 0) return 1 + normalizeFn(e.deltaY);
        else return 1 - normalizeFn(-e.deltaY);
      })()
      let newDisplayRadius = s.settings.display.domain.displayRadius * multiplier;
      s.settings.display.domain.displayRadius = newDisplayRadius;
      return s;

    }, queue: s => {

      let queue: QueueItem[] = ["HANDLE:mouseMoveEvent"];
      queue = ["RELOAD:rig",
        ["ERASE", ["figure", "pathOverlay", "controlPointsOverlay", "selectionOverlay", "hoverOverlay"]]]

      if (s.state.options.axis) queue = [...queue, "DO:drawAxis"]

      return queue;

    }
    }).eval();

  }

}


const setupWheelHandler: EventResponseSetup = (target, session, _) => {

  target.onwheel = (e: WheelEvent) => handleWheelEvent(session, e);

}

export default setupWheelHandler;
