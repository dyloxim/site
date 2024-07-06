import { I_session, I_sessionState } from "@IFS/types/state";
import { I_settings } from "@IFS/types/configuration";

import { default as FunctionSystem } from "@IFS/functionSystem";
import { default as DisplayApperatus } from "@IFS/display/displayApperatus";
import { default as Rig } from "./display/rig";

import { defaultState as baseState } from "@IFS/resources/defaults"
import Delegator from "./execution/delegator";

export default class App {

  settings: I_settings;
  state: I_sessionState;

  FS: FunctionSystem
  display: DisplayApperatus | undefined;

  // SETUP FUNCTIONS

  constructor(settings: I_settings) {
    this.settings = settings;
    this.FS = new FunctionSystem(this.settings.FS);
    this.state = App.getInitialState(this.settings.FS.firstPoint);
  }

  static constructWithState = (session: I_session): App => {
    let app = new App(session.settings)
    app.state = session.state;
    return app;
  }

  static getInitialState = (firstPoint: number[]): I_sessionState => {
    let state = baseState;
    state.program.thisTurn.position = firstPoint;
    state.program.lastTurn.position = firstPoint;
    return state;
  }

  setupDisplay = (displayContainer: HTMLDivElement) => {
    this.settings.display.domain = Rig.handlePossibleImpliedDisplayRegion(
      this.settings.FS.referenceRegion,
      this.settings.display.domain
    );
    this.display = new DisplayApperatus(this.settings.display, displayContainer);
  }


  // CORE PROCESS

  start = (): void => {

    Delegator.doFirstDraw({
      session: { settings: this.settings, state: this.state },
      FS: this.FS,
      display: this.display!
    });
    requestAnimationFrame(this.animateFn);

  }

  animateFn = (timeStamp: number): void => {

    if (this.state.animation.frameTimes.first === undefined)
      this.state.animation.frameTimes.first = timeStamp

      if (this.state.animation.frameTimes.previous !== timeStamp) {
        Delegator.handleTurn({
          session: { settings: this.settings, state: this.state },
          FS: this.FS,
          display: this.display!
        });
      }

    this.state.animation.frameTimes.previous = timeStamp;

    window.requestAnimationFrame(this.animateFn);

  }


}
