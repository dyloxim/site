import { default as SessionMutation } from "@IFS/execution/sessionMutation"
import { EventResponseSetup } from "@IFS/types/UI";


const setupWheelHandler: EventResponseSetup = (canvas, session, Ctx) => {

  canvas!.addEventListener('wheel', (e: WheelEvent): void => {

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

      }, queue: _ => [

        "RELOAD:rig",
        ["ERASE", ["figure", "controlPointsOverlay", "selectionOverlay"]]

      ]}).eval();

    }}, false);
}

export default setupWheelHandler;
