import { default as EventHandlers } from '@IFS/UI/page/eventHandlers';
import { Ctx } from '@IFS/types/UI';
import { I_session } from '@IFS/types/state';

const setupEventHandlers = (session: I_session, ctx: Ctx) => {

  let canvas = (document.getElementById("displayContainer")!
    .lastChild as HTMLCanvasElement);

  EventHandlers.canvasEvents
    .forEach(handlerInit => { handlerInit(canvas, session, ctx) });

  EventHandlers.windowEvents
    .forEach(handlerInit => { handlerInit(canvas, session, ctx) });

  window.visualViewport!.addEventListener('resize', (e: Event) => {
    console.log("resizing visual viewport");
    e.stopPropagation();
    e.preventDefault();
  }, {
    passive: false
  });



}

export default setupEventHandlers;
