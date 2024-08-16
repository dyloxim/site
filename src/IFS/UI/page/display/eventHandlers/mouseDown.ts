import { default as SessionMutation } from "@IFS/execution/sessionMutation"
import { I_session } from "@IFS/types/state";

const setupMouseDownHandler = (
  canvas: HTMLCanvasElement,
  context: {
    session: I_session,
    updateSession: React.Dispatch<React.SetStateAction<I_session>>
  }
) => {

    canvas!.addEventListener('mousedown', (_: MouseEvent): void => {

      context.updateSession({...new SessionMutation({ using: context.session, do: s => {

        s.state.mouse.down = s.state.mouse.pos;
        return s;

      }, queue: _ => [

        "HANDLE:mouseDownEvent"

      ]}).eval()})

    }, false);
}

export default setupMouseDownHandler;
