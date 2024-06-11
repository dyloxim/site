import I_DisplayParams from "@IFS/types/I_displayParams";

export default class State {
  running = false;
  currentPoint: number[];
  displayParams: I_DisplayParams;

  constructor(firstPoint: number[], displayParams: I_DisplayParams) {
    this.currentPoint = firstPoint;
    this.displayParams = displayParams;
  }
}

