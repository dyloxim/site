import { I_session } from "@IFS/types/state";
import { useContext, useEffect, useRef } from "react";
import { Ctx } from '@IFS/UI/SharedUIState';
import getPageLoader from "../util/getPageLoader";
import { default as AppEngine } from "@IFS/app";
import resizeFn from "@IFS/UI/util/resizeFn";
import { I_displayConfig, I_functionSystem } from "@IFS/types/configuration";
import { I_UIContext } from "@IFS/types/UI";

const Canvas = ({session, app, preset}: {
  session: I_session,
  app: AppEngine,
  preset: {
    display: I_displayConfig,
    FS: I_functionSystem,
    getRandom: () => number
  }
}) => {

  const {ctx, setCtx} = useContext(Ctx);
  const ctxRef = useRef<I_UIContext>(ctx); useEffect(() => {ctxRef.current = ctx;}, [ctx])

  const container = useRef<HTMLDivElement | null>(null);


  let onLoad = () => {
    getPageLoader({
      app: app, 
      container: container.current!,
      session: session,
      preset: preset,
      Ctx: {ctxRef, setCtx},
      resizeFn: resizeFn
    })();
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
        border: "solid #bbb 1px",
      }}>
    </div>
  )
}

export default Canvas;
