import { I_session } from "@IFS/types/state";
import { default as SessionMutation } from "@IFS/execution/sessionMutation";
import { Ctx } from '@IFS/UI/SharedUIState';
import { useContext, useEffect, useRef } from "react";
import getPageLoader from "../util/getPageLoader";
import { default as AppEngine } from "@IFS/app";
import resizeFn from "@IFS/UI/util/resizeFn";
import { I_displayConfig, I_functionSystem } from "@IFS/types/configuration";

const Canvas = ({session, app, preset}: {
  session: I_session,
  app: AppEngine,
  preset: {
    display: I_displayConfig,
    FS: I_functionSystem
  }
}) => {

  const {ctx, setCtx} = useContext(Ctx);
  const container = useRef<HTMLDivElement | null>(null);

  const handleMouseUpEvent = () => {
    new SessionMutation({ using: session, do: s => {

      s.state.mouse.down = null;
      s.state.tacit.draggingRig = null;
      s.state.tacit.mutatingFS = false;
      s.state.mouse.interactionPrimed = false;
      s.state.inputSelected = null;
      if (s.state.tacit.mutatingFS) setCtx({...ctx, FS: s.settings.FS.transforms });

      return s;

    }}).eval();
  }

  let onLoad = () => {
    let loader = getPageLoader({
      app: app, 
      container: container.current!,
      session: session,
      preset: preset,
      Ctx: {ctx, setCtx},
      resizeFn: resizeFn
    });
    loader();
    container.current!.addEventListener('mouseup', handleMouseUpEvent, false);
  }

  useEffect(() => {

    if (document.readyState === 'complete') onLoad();

    else {
      window.addEventListener('load', onLoad, false);
      return () => window.removeEventListener('load', onLoad);
    }

  }, []);
  

  return (
    <div
      id="displayContainer"
      ref={container}
      style={{
        position: "relative",
        border: "solid #2d2d2f 1px"
      }}>
    </div>
  )
}

export default Canvas;
