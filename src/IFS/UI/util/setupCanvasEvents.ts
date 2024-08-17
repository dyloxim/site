import { default as EventHandlers } from '@IFS/UI/page/eventHandlers';
import { I_UIContext } from '@IFS/types/UI';
import { I_session } from '@IFS/types/state';

const setupCanvasEvents = (
  session: I_session,
  setCtx: React.Dispatch<React.SetStateAction<I_UIContext>>
) => {
  let canvas = document.getElementById("hoverOverlayCanvas")! as HTMLCanvasElement;
  EventHandlers.forEach(handlerInit => { handlerInit(canvas, session, setCtx) });
}

export default setupCanvasEvents;
