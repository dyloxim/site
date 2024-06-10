
export default class State {
  running = false;
  currentPoint: number[];

  constructor(firstPoint: number[]) {
    this.currentPoint = firstPoint;
  }
}

