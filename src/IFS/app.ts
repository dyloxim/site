import { I_session, I_state } from "@IFS/types/operationTypes";
import { I_settings } from "@IFS/types/configTypes";

import { default as FunctionSystem } from "@IFS/functionSystem";
import { default as DisplayApperatus } from "@IFS/display/displayApperatus";
import { default as Rig } from "./display/rig";
import { default as Color } from "@IFS/display/util/color";

import { defaultState as baseState } from "@IFS/resources/defaults"
import TurnTaker from "./turnTaker";

export default class App {

  settings: I_settings;
  state: I_state;

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

  static getInitialState = (firstPoint: number[]): I_state => {
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
    this.state.animation.running = true;
    TurnTaker.setup(this.settings, this.state, this.FS, this.display!)
    requestAnimationFrame(this.animateFn);
  }

  animateFn = (timeStamp: number): void => {

    // check if session parameters have changed and make changes accordingly
    TurnTaker.readSettings(this.settings, this.state, this.display!)

    // main IFS iterations loop
    if (this.state.animation.running) {

      if (this.state.animation.frameTimes.first === undefined)
        this.state.animation.frameTimes.first = timeStamp

      if (this.state.animation.frameTimes.previous !== timeStamp) {
        TurnTaker.runItteration(this.settings, this.state, this.FS, this.display!)
      }

      this.state.animation.frameTimes.previous = timeStamp;
    }

    window.requestAnimationFrame(this.animateFn);
  }


}
