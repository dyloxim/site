import { default as AppEngine } from "@IFS/app";
import setupEventHandlers from "@IFS/UI/util/setupEventHandlers";
import { SetupInputs } from "@IFS/types/UI";
import deviceIsMobileOrTablet from "./deviceIsMobileOrTablet";

const setupApp = (inputs: SetupInputs) => {
  return () => {
    if (!inputs.container.firstChild) {
      inputs.session.settings.display.rendering
        .devicePixelRatio = document.defaultView!.devicePixelRatio;
      inputs.session.state = AppEngine.getInitialState(inputs.preset);
      inputs.container.style.width = `${document.body.clientWidth}px`;
      inputs.container.style.height = `${window.innerHeight - 132}px`;
      inputs.app.setupDisplay(inputs.container);
      if (deviceIsMobileOrTablet()) inputs.app.display!.config.tacit.isMobile = true;
      setupEventHandlers(inputs.session, inputs.ctx);
      inputs.app.start();
    }
  }
}

export default setupApp;
