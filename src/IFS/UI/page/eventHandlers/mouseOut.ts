import { default as SessionMutation } from "@IFS/execution/sessionMutation"
import { EventResponseSetup } from "@IFS/types/UI";

const setupMouseOutHandler: EventResponseSetup = (canvas, session, Ctx) => {

  canvas!.addEventListener('mouseout', (_: MouseEvent): void => {

    new SessionMutation({ using: session, do: s => s,
      queue: _ => ["HANDLE:mouseOutEvent"]
    }).eval();
  })

}

export default setupMouseOutHandler;
