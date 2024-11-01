import { default as SessionMutation } from "@IFS/execution/sessionMutation"
import { Ctx, EventResponseSetup } from "@IFS/types/UI";
import { I_session } from "@IFS/types/state";

const handleBackspace = (ctx: Ctx, session: I_session) => {

 if (session.state.selected.length == 1 && session.settings.FS.weights.length > 1) {

   new SessionMutation({ using: session, do: s => {

     let id = s.state.selected[0];
     let n = s.settings.FS.weights.length - 1;

     s.settings.FS.transforms.splice(s.state.selected[0], 1);
     s.settings.FS.weights = s.settings.FS.weights == "uniform" ? "uniform"
       : s.settings.FS.weights.toSpliced(id, 1);
     s.state.tacit.pendingFSUpdate = true;
     s.state.selected = [];
     ctx.set({...ctx.ref.current, FS: s.settings.FS.transforms })
      
     return s;

   }, queue: _ => [

     "HANDLE:mouseDownEvent",
     "RELOAD:FS",
     ["ERASE", ["selectionOverlay"]], "REVIEW:controlPoints"
     
   ]}).eval();

 }

}

const handleSpace = (ctx: Ctx, session: I_session, e: KeyboardEvent) => {

  e.preventDefault();

  new SessionMutation({ using: session, do: s => {

    s.state.options.running = !s.state.options.running;
    ctx.set({...ctx.ref.current, running: s.state.options.running});
    return s;

  }}).eval();

}

const handleArrowKey = (session: I_session, e: KeyboardEvent) => {

  // TODO: finish implementing

  // e.preventDefault();

  // if (s.state.selected.length == 1) {
  //   let delta = .1;

  //   let translation = new Map([
  //     ["ArrowLeft", [0,-delta]],
  //     ["ArrowRight", [0,delta]],
  //     ["ArrowDown", [-delta,0]],
  //     ["ArrowUp", [delta,0]]
  //   ]).get(e.key)

  //   new SessionMutation({ using: session, do: s => {

  //     s.state.options.running = !s.state.options.running;
  //     return s;

  // }}).eval();
  // }


}

const handleKeyDown = (ctx: Ctx, session: I_session, e: KeyboardEvent) => {

  switch (e.key) {

    case "Backspace":
      handleBackspace(ctx, session); break;

    case " ":
      handleSpace(ctx, session, e); break;

    case "ArrowLeft": 
    case "ArrowUp": 
    case "ArrowDown": 
    case "ArrowRight": 
      handleArrowKey(session, e); break;

  }

}

const setupKeyDownHandler: EventResponseSetup = (_canvas, session, ctx) => {

  window.onkeydown = (e: KeyboardEvent) => handleKeyDown(ctx, session, e);

}

export default setupKeyDownHandler;
