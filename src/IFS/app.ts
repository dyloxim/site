import { I_session, I_settings, I_state } from "./types";
import FunctionSystem from "@IFS/functionSystem";
import DisplayApperatus from "@IFS/display/displayApperatus";
import Color from "@IFS/display/color";


export default class App {

  settings: I_settings;
  state: I_state;

  FS: FunctionSystem
  display: DisplayApperatus | undefined;

  constructor(settings: I_settings) {
    this.settings = settings;
    this.FS = new FunctionSystem(this.settings.program.FS);
    this.state = App.getInitialState(this.settings.program.firstPoint);
  }

  static constructWithState = (session: I_session): App => {
    let app = new App(session.settings)
    app.state = session.state;
    return app;
  }

  static getInitialState = (firstPoint: number[]): I_state => {
    return {
      program: {
        thisTurn: {
          position: firstPoint,
          choice: -1,
        },
        lastTurn: {
          position: firstPoint,
          choice: -1,
        }
      },
      animation: {
        running: false,
        frameTimes: {
          first: null,
          previous: null,
        }
      },
      interaction: {
        wantsRedraw: false,
        updatePending: false
      }
    }
  }

  setupDisplay = (canvas: HTMLCanvasElement) => {
    this.display = new DisplayApperatus(this.settings.display, canvas);
  }

  getRandomFunctionIndex = (): number => {
    let probabilitySum = this.FS.weights[0]
    let regions = this.FS.weights.slice();
    for (let i = 1; i < this.FS.order(); i++) {
      probabilitySum += this.FS.weights[i]
      regions[i] = probabilitySum;
    }
    let dart = Math.random()
    let choice = 0
    for (let i = 0; i < this.FS.order(); i++) {
      if (regions[i] > dart) { choice = i; break; }
    }
    return choice;
  }

  getColor = (functionIndex: number): Color => {
    if (this.settings.display.color.multi) {
      return this.settings.display.color
        .palette.colors[functionIndex];
    } else {
      return this.settings.display.color.base;
    }
  }

  runItteration = (): void => {

    let choice = this.getRandomFunctionIndex()

    this.state.program.lastTurn = this.state.program.thisTurn

    this.state.program.thisTurn = {
      position: this.FS.transforms[choice]
        .apply(this.state.program.thisTurn.position),
      choice: choice
    }

    this.markCurrentPoint()
  }

  markCurrentPoint = (): void => {
    let thisTurn = this.state.program.thisTurn;
    this.display?.addPoint(thisTurn.position, this.getColor(thisTurn.choice));
  }

  animateFn = (timeStamp: number): void => {

    if (this.state.interaction.updatePending) {
      if (this.state.interaction.wantsRedraw) {
        this.display?.reconstruct(this.settings.display);
        this.state.interaction.wantsRedraw = false;
      }
      this.state.interaction.updatePending = false;
    }

    if (this.state.animation.running) {

      if (this.state.animation.frameTimes.first === undefined) {
        this.state.animation.frameTimes.first = timeStamp
      }

      if (this.state.animation.frameTimes.previous !== timeStamp) {
        Array.from({ length: this.settings.animation.rate }, _ => this.runItteration())
        this.display!.update();
      }

      this.state.animation.frameTimes.previous = timeStamp;

    }

    window.requestAnimationFrame(this.animateFn);
  }

  start = (): void => {
    this.state.animation.running = true;
    this.display!.update();
    requestAnimationFrame(this.animateFn);
  }

}
