import { default as SessionMutation } from "@IFS/execution/sessionMutation"
import { EventResponseSetup } from "@IFS/types/UI";

const setupMouseDownHandler: EventResponseSetup = (canvas, session, setCtx) => {

  canvas!.addEventListener('mousedown', (_: MouseEvent): void => {

    new SessionMutation({ using: session, do: s => {

      s.state.mouse.down = s.state.mouse.pos;
      return s;

    }, queue: _ => [

      "HANDLE:mouseDownEvent"

    ]}).eval();

  }, false);
}

export default setupMouseDownHandler;
