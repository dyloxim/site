import { default as SessionMutation } from "@IFS/execution/sessionMutation"
import { I_session } from '@IFS/types/state'

const setupWheelHandler = (
  canvas: HTMLCanvasElement,
  session: I_session,
) => {

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

        "RELOAD:rig"

      ]}).eval()

    }}, false);
}

export default setupWheelHandler;
