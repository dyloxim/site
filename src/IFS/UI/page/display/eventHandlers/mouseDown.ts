
import { default as SessionMutation } from "@IFS/execution/sessionMutation"
import { I_session } from '@IFS/types/state'

const setupMouseDownHandler = (
  canvas: HTMLCanvasElement,
  session: I_session,
) => {

    canvas!.addEventListener('mousedown', (_: MouseEvent): void => {

      new SessionMutation({ using: session, do: s => {

        s.state.mouse.down = s.state.mouse.pos;
        return s;

      }, queue: _ => [

        "HANDLE:mouseDownEvent"

      ]}).eval()

    }, false);
}

export default setupMouseDownHandler;
