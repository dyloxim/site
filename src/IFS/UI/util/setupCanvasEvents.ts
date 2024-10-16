import { default as EventHandlers } from '@IFS/UI/page/eventHandlers';
import { I_UIContext } from '@IFS/types/UI';
import { I_session } from '@IFS/types/state';

const setupCanvasEvents = (
  session: I_session,
  Ctx: {
    ctxRef: React.MutableRefObject<I_UIContext>,
    setCtx: React.Dispatch<React.SetStateAction<I_UIContext>>
  }
) => {
  let canvas = (document.getElementById("displayContainer")!.lastChild as HTMLCanvasElement);
  EventHandlers.forEach(handlerInit => { handlerInit(canvas, session, Ctx) });
}

export default setupCanvasEvents;
