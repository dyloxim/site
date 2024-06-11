import FunctionSystem from "@IFS/functionSystem";
import State from "@IFS/process/state";
import DisplayApperatus from "@IFS/display/displayApperatus";
import I_Preset from "@IFS/types/I_preset";
import Color from "@IFS/display/color";

export default class App {

  display: DisplayApperatus;
  functionSystem: FunctionSystem;
  lastChoice: number;
  state: State;
  animationStart: number | undefined;
  lastFrameTime: number | undefined;
  animationRate = 100;

  constructor(canvas: HTMLCanvasElement, preset: I_Preset) {
    this.lastChoice = -1;
    this.display = new DisplayApperatus(canvas, preset.displayParams);
    this.functionSystem = new FunctionSystem(preset.functionSystem);
    this.state = new State(preset.firstPoint, preset.displayParams);
  }

  updateChoice = (): void => {
    let probabilitySum = this.functionSystem.weights[0]
    let regions = this.functionSystem.weights.slice();
    for (let i = 1; i < this.functionSystem.order; i++) {
      probabilitySum += this.functionSystem.weights[i]
      regions[i] = probabilitySum;
    }
    let dart = Math.random()
    let choice = 0
    for (let i = 0; i < this.functionSystem.order; i++) {
      if (regions[i] > dart) { choice = i; break; }
    }
    this.lastChoice = choice
  }

  updatePoint = (): void => {
    this.updateChoice();
    this.state.currentPoint = this.functionSystem.transforms[this.lastChoice]
      .apply(this.state.currentPoint)
  }

  getColor = (): Color => {
    if (this.state.displayParams.useColor) {
      return this.state.displayParams.palette.colors[this.lastChoice];
    } else {
      return this.state.displayParams.baseColor
    }
  }

  start = (): void => {
    this.state.running = true;
    this.display.addPoint(this.state.currentPoint, this.state.displayParams.baseColor);
    this.display.update();
    requestAnimationFrame(this.animateFn);
  }

  stop = (): void => {
    this.state.running = false;
  }

  animateFn = (timeStamp: number): void => {
    if (this.animationStart === undefined) { this.animationStart = timeStamp }

    if (this.lastFrameTime !== timeStamp) {
      for(let i = 0; i < this.animationRate; i++) {
        this.updatePoint();
        this.display.addPoint(this.state.currentPoint, this.getColor());
      }
      this.display.update();
    }


    this.lastFrameTime = timeStamp;

    if (this.state.running) {
      window.requestAnimationFrame(this.animateFn);
    }
  }


}
