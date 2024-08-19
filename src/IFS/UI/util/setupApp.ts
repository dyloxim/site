import { default as AppEngine } from "@IFS/app";
import setupCanvasEvents from "@IFS/UI/util/setupCanvasEvents";
import { SetupFn } from "@IFS/types/UI";

const setupApp: SetupFn = (inputs) => {
  if (!inputs.container.firstChild) {
    inputs.session.settings = inputs.preset;
    inputs.session.settings.display.rendering.devicePixelRatio = document.defaultView!.devicePixelRatio;
    inputs.session.state = AppEngine.getInitialState(inputs.preset);
    inputs.container.style.width = `${document.body.clientWidth}px`;
    inputs.container.style.height = `${window.innerHeight - 132}px`;
    inputs.app.setupDisplay(inputs.container);
    setupCanvasEvents(inputs.session, inputs.Ctx);
    inputs.app.start();
  }
}

export default setupApp;
