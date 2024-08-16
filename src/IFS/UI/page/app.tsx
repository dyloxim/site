'use client'
import { default as EventHandlers } from './display/eventHandlers';
import { default as SessionMutation } from "@IFS/execution/sessionMutation";
import { I_displayConfig, I_functionSystem } from '@IFS/types/configuration';

import { default as QuickControls } from'./controls/quickControls';
import { default as ReadOut } from './readOut/panel';

import { useContext, useEffect, useRef } from 'react';
import { SharedUIState } from '@IFS/UI/SharedUIState';
import { default as AppEngine } from "@IFS/app";



// the top level entry point component for the IFS app

export default function App({ preset }: {
  preset?: {
    display: I_displayConfig,
    FS: I_functionSystem
  }
}) {

  const {session, updateSession} = useContext(SharedUIState)
  const displayContainerRef = useRef<HTMLDivElement | null>(null);
  let app: AppEngine

  const setupApp = (container: HTMLDivElement) => {
    if (!container.firstChild) {
      app  = AppEngine.constructWithState(session);
      if (typeof preset !== 'undefined') {
        session.settings = preset;
        session.state = AppEngine.getInitialState(preset);
        updateSession({...session});
      }
      container.style.width = `${document.body.clientWidth}px`;
      container.style.height = `${window.innerHeight - 180}px`;
      app.setupDisplay(container);
      setupCanvasEvents();
      app.start();
    }
  }

  const setupCanvasEvents = () => {
    let canvas = document.getElementById("hoverOverlayCanvas")! as HTMLCanvasElement;
    EventHandlers.forEach(handlerInit => { handlerInit(canvas, {session, updateSession}) });
  }

  const calibrateContainer = (container: HTMLDivElement) => {
    container.style.width = `${document.body.clientWidth}px`;
    container.style.height = `${window.innerHeight - 180}px`;
  }

  const deviceIsMobileOrTablet =() => {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor);
    return check;
  };

  const onPageLoad = () => {

    setupApp(displayContainerRef.current!);

    window.addEventListener('resize', _ => { if (!deviceIsMobileOrTablet()) {

      calibrateContainer(displayContainerRef.current!)
      updateSession({...new SessionMutation({ using: session, queue: _ => [
        "DO:calibrateDisplay",
        "RELOAD:rig"
      ]}).eval()});

    }})}


  useEffect(() => {
    if (document.readyState === 'complete') {
      onPageLoad();
    } else {
      window.addEventListener('load', onPageLoad, false);
      return () => window.removeEventListener('load', onPageLoad);
    }
  }, []);

  return (
    <>
      <SharedUIState.Provider value={{session, updateSession}}>
        <div
          id="displayContainer"
          ref={displayContainerRef}
          style={{
            position: "relative",
            border: "solid #2d2d2f 1px"
          }}>
        </div>
        <br/>
        {// <NavControls ctx={UIContext}/>
        }
        <QuickControls/>
        {// <ExtendedControls ctx={UIContext}/>
        }
        <ReadOut/>
        {// <Info/>
        }
      </SharedUIState.Provider>
    </>
  )

}
