import { default as AppEngine } from "@IFS/app";
import setupCanvasEvents from "@IFS/UI/util/setupCanvasEvents";
import { SetupFn } from "@IFS/types/UI";

const setupApp: SetupFn = (inputs) => {
  if (!inputs.container.firstChild) {
    inputs.session.settings = inputs.preset;
    inputs.session.state = AppEngine.getInitialState(inputs.preset);
    inputs.container.style.width = `${document.body.clientWidth}px`;
    inputs.container.style.height = `${window.innerHeight - 180}px`;
    inputs.app.setupDisplay(inputs.container);
    setupCanvasEvents(inputs.session, inputs.contextUpdater);
    inputs.app.start();
  }
}

export default setupApp;
