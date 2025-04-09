import Line from "./line";

export default class Rect {
  ax: number
  ay: number
  bx: number
  by: number

  constructor(ax: number, ay: number, bx: number, by: number) {
    this.ax = ax;
    this.ay = ay;
    this.bx = bx;
    this.by = by;
  }

  constrainLine(line: Line): Line | null {

    let [x0, y0, x1, y1] = [...line.p, ...line.v];

    const INSIDE = 0, LEFT = 1, RIGHT = 2, BOTTOM = 4, TOP = 8;
        
    const computeOutCode = (x: number, y: number) => {
      let code = INSIDE;
      if (x < this.ax) code |= LEFT;
      else if (x > this.bx) code |= RIGHT;
      if (y < this.ay) code |= BOTTOM;
      else if (y > this.by) code |= TOP;
      return code;
    };

    let outCode0 = computeOutCode(x0, y0);
    let outCode1 = computeOutCode(x1, y1);
    let accept = false;

    while (true) {
      if (!(outCode0 | outCode1)) { // Bitwise OR is 0: both inside
        accept = true;
        break;
      } else if (outCode0 & outCode1) { // Bitwise AND is not 0: both outside
        break;
      } else {
        let x: number, y: number;
        let outCodeOut = outCode0 ? outCode0 : outCode1;
                
        if (outCodeOut & TOP) {
          x = x0 + (x1 - x0) * (this.by - y0) / (y1 - y0);
          y = this.by;
        } else if (outCodeOut & BOTTOM) {
          x = x0 + (x1 - x0) * (this.ay - y0) / (y1 - y0);
          y = this.ay;
        } else if (outCodeOut & RIGHT) {
          y = y0 + (y1 - y0) * (this.bx - x0) / (x1 - x0);
          x = this.bx;
        } else {
          y = y0 + (y1 - y0) * (this.ax - x0) / (x1 - x0);
          x = this.ax;
        }
                
        if (outCodeOut === outCode0) {
          x0 = x;
          y0 = y;
          outCode0 = computeOutCode(x0, y0);
        } else {
          x1 = x;
          y1 = y;
          outCode1 = computeOutCode(x1, y1);
        }
      }
    }

    return accept ? new Line([x0, y0], [x1, y1]) : null;

  }

}
