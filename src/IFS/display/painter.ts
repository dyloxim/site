import { default as Color } from './util/color';
import { default as Rect } from "./util/rect";
import { default as Num } from "@IFS/math/numerical/num";
import { default as PrintLayer } from "./printLayer";

export default class Painter {

  static isVisible(outSpace: Rect, pos: number[]): boolean {
    return (pos[0] > 0 && pos[0] < outSpace.width && pos[1] > 0 && pos[1] < outSpace.height)
  }

  static putPixel(print: PrintLayer, printArea: Rect, pos: number[], color: Color): void {
    if (this.isVisible(printArea, pos)) {
      const index = 4 * (pos[1] * printArea.width + pos[0]);
      print.mark(index, color)
    }
  }

  static putPixel_quantize(print: PrintLayer, printArea: Rect, pos: number[], color: Color): void {
    let pos_Q = pos.map(a => Math.round(a));
    if (this.isVisible(printArea, pos_Q)) {
      const index = 4 * (pos_Q[1] * printArea.width + pos_Q[0]);
      print.mark(index, color)
    }
  }

  static putLine(
    print: PrintLayer,
    printArea: Rect,
    [px, py]: number[],
    [qx, qy]: number[],
    color: Color
  ) {

    let was_steep = Math.abs(qy - py) > Math.abs(qx - px);

    let [_px, _py, _qx, _qy] = [px, py, qx, qy]; // mirrored or flipped working coordinates
    if (was_steep) { [_px, _py, _qx, _qy] = [py, px, qy, qx]; } // mirroring in x=y
    if (_px > _qx) { [_px, _py, _qx, _qy] = [_qx, _qy, _px, _py]; } // swapping p and q
    let [_dx, _dy] = [_qx - _px, _qy - _py];
    let _m = (_dx === 0) ? 1 : _dy / _dx;

    // paint p
    let _px_Q = Num.round(_px), _py_Q = Num.integerPart(_py + _m * (_px_Q - _px))
    this.putPixel(print, printArea, was_steep ? [_py_Q, _px_Q] : [_px_Q, _py_Q], color)

    // paint q
    let _qx_Q = Num.round(_qx), _qy_Q = Num.integerPart(_qy + _m * (_qx_Q - _qx))
    this.putPixel(print, printArea, was_steep ? [_qy_Q, _qx_Q] : [_qx_Q, _qy_Q], color)

    let _dolly_y = _py + _m;
    let _dolly_y_Q = Num.integerPart(_dolly_y);

    for (var _dolly_x_Q = _px_Q + 1; _dolly_x_Q < _qx_Q; _dolly_x_Q++) {
      this.putPixel(print, printArea, was_steep ? [_dolly_y_Q, _dolly_x_Q] : [_dolly_x_Q, _dolly_y_Q], color);
      _dolly_y = _dolly_y + _m;
      _dolly_y_Q = Num.integerPart(_dolly_y)
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
