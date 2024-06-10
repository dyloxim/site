import FunctionSystem from "@IFS/functionSystem";
import State from "@IFS/process/state";
import DisplayApperatus from "@IFS/display/apperatus";
import I_Preset from "@IFS/types/I_preset";

export default class App {

  display: DisplayApperatus;
  functionSystem: FunctionSystem;
  state: State;
  animationStart: number | undefined;
  lastFrameTime: number | undefined;
  animationRate = 100;

  constructor(canvas: HTMLCanvasElement, preset: I_Preset) {
    this.display = new DisplayApperatus(canvas, preset.displayParams);
    this.functionSystem = new FunctionSystem(preset.functionSystem);
    this.state = new State(preset.firstPoint);
  }

  updatePoint = (): void => {
    this.state.currentPoint = this.functionSystem.randomTransform()
      .apply(this.state.currentPoint)
  }

  showCurrent = (): void => {
    this.display.addPoint(this.state.currentPoint, this.display.displayParams.baseColor);
    this.display.update();
  }

  start = (): void => {
    this.state.running = true;
    this.showCurrent()
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
        this.showCurrent();
      }
    }

    this.lastFrameTime = timeStamp;

    if (this.state.running) {
      window.requestAnimationFrame(this.animateFn);
    }
  }


}
