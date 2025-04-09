import { default as Color } from './util/color';
import { default as Rect } from "./util/rect";
import { default as PrintLayer } from "./printLayer";
import { default as GeomRect } from "../math/geometry/rect";
import { default as Line } from "../math/geometry/line";

export default class Painter {

  static isVisible(outSpace: Rect, pos: number[]): boolean {
    return (pos[0] > 0 && pos[0] < outSpace.width && pos[1] > 0 && pos[1] < outSpace.height)
  }

  static putPixel(print: PrintLayer, printArea: Rect, pos: number[], color: Color): void {
    if (this.isVisible(printArea, pos)) {
      const index = 4 * (pos[1] * printArea.width + pos[0]);
      if (print.name !== "figure" || print.draft.data[index + 3] != 255) {
        print.mark(index, color)
      }
    }
  }

  static putPixel_quantize(print: PrintLayer, printArea: Rect, pos: number[], color: Color): void {
    let pos_Q = pos.map(a => Math.floor(a));
    this.putPixel(print, printArea, pos_Q, color);
  }

  static putLine(
    print: PrintLayer,
    printArea: Rect,
    [px, py]: number[],
    [qx, qy]: number[],
    color: Color
  ) {


    let cLine = new GeomRect(
      0, 0, printArea.width, printArea.height
    ).constrainLine(new Line([px, py], [qx, qy]));

    if (cLine) {

      [px, py, qx, qy] = [cLine.p[0], cLine.p[1], cLine.v[0], cLine.v[1]];

      [px, py, qx, qy] = [px, py, qx, qy].map(u => Math.floor(u));

      let dx = Math.abs(qx - px);
      let sx = (px < qx) ? 1 : -1;
      let dy = - Math.abs(qy - py)
      let sy = (py < qy) ? 1 : -1;

      let e = dx + dy

      while(true) {

        this.putPixel(print, printArea, [px, py], color)
      
        if (px == qx && py == qy) break;

        let e_2 = 2 * e;

        if (e_2 >= dy) {
          if (px == qx) break;
          e = e + dy;
          px = px + sx;
        }

        if (e_2 <= dx) {
          if (py == qy) break;
          e = e + dx;
          py = py + sy;
        }

      }

    }
    
  }

  

  static putSolidParallelogram(
    print: PrintLayer,
    printArea: Rect,
    [px, py]: number[],
    [qx, qy]: number[],
    [rx, ry]: number[],
    color: Color
  ) {

    [px, py, qx, qy, rx, ry] = [px, py, qx, qy, rx, ry].map(u => Math.floor(u));

    let dx = Math.abs(qx - px);
    let sx = (px < qx) ? 1 : -1;
    let dy = - Math.abs(qy - py)
    let sy = (py < qy) ? 1 : -1;

    let [vx, vy] = [rx - px, ry - py];

    let e = dx + dy

    while(true) {

      this.putLine(print, printArea, [px, py], [px + vx, py + vy], color)
      
      if (px == qx && py == qy) break;

      let e_2 = 2 * e;

      if (e_2 >= dy) {
        if (px == qx) break;
        e = e + dy;
        px = px + sx;
      }

      if (e_2 <= dx) {
        if (py == qy) break;
        e = e + dx;
        py = py + sy;
      }

    }

  }

  // stolen from here: https://medium.com/@trey.tomes/bresenhams-circle-algorithm-2153b32a0ecf
  static putCircle(
    print: PrintLayer,
    printArea: Rect,
    [xc, yc]: number[],
    r: number,
    fill: boolean,
    color: Color
  ) {
    xc = Math.floor(xc);
    yc = Math.floor(yc);
    r = Math.floor(r);

    const drawOctants = (x: number, y: number) => {
      this.putPixel(print, printArea, [xc + x, yc + y], color);
      this.putPixel(print, printArea, [xc - x, yc + y], color);
      this.putPixel(print, printArea, [xc + x, yc - y], color);
      this.putPixel(print, printArea, [xc - x, yc - y], color);

      this.putPixel(print, printArea, [xc + y, yc + x], color);
      this.putPixel(print, printArea, [xc - y, yc + x], color);
      this.putPixel(print, printArea, [xc + y, yc - x], color);
      this.putPixel(print, printArea, [xc - y, yc - x], color);
    };

    const fillOctants = (x: number, y: number) => {
      for (let xx = xc - x; xx <= xc + x; xx++) this.putPixel(print, printArea, [xx, yc + y], color);
      for (let xx = xc - x; xx <= xc + x; xx++) this.putPixel(print, printArea, [xx, yc - y], color);
      for (let xx = xc - y; xx <= xc + y; xx++) this.putPixel(print, printArea, [xx, yc + x], color);
      for (let xx = xc - y; xx <= xc + y; xx++) this.putPixel(print, printArea, [xx, yc - x], color);
    }

    let x = 0, y = r;
    let d = 3 - 2 * r;
    fill ? fillOctants(x, y) : drawOctants(x, y);
    while (y >= x) {
      x++;

      if (d > 0) {
        y--;
        d = d + 4 * (x - y) + 10;
      } else {
        d = d + 4 * x + 6;
      }
      fill ? fillOctants(x, y) : drawOctants(x, y);
    }
  }

}
