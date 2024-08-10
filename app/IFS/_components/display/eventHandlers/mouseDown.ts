
import { default as SessionMutation } from "@IFS/execution/sessionMutation"
import { I_session } from '@IFS/types/state'

const setupMouseDownHandler = (
  canvas: HTMLCanvasElement,
  session: I_session,
  setStateFn: React.Dispatch<React.SetStateAction<I_session>>
) => {

    canvas!.addEventListener('mousedown', (_: MouseEvent): void => {

      setStateFn(new SessionMutation({ using: session, do: s => {

        s.state.mouse.down = s.state.mouse.pos;
        return s;

      }, queue: _ => [

        "HANDLE:mouseDownEvent"

      ]}).result());

    }, false);
}

export default setupMouseDownHandler;
