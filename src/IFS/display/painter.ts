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
    if (was_steep) { [_px, _py, _qx, _qy] = [_py, _px, _qy, _qx]; } // mirroring in x=y
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

  static putSolidParallelogram(
    print: PrintLayer,
    printArea: Rect,
    [px, py]: number[],
    [qx, qy]: number[],
    [rx, ry]: number[],
    color: Color
  ) {

    // NOTES: an underscore prefix, i.e. "_V" indicates that the variable contains the
    //   working value of the point "V" -- in particular this means that "_V" may either be mirrored
    //   in x=y, or it may also have been swapped with its partner point from the other end of the line.
    //
    // in the case that the point has been mirrored (when condition 'was_steep' is met), then the point
    //   will have to be re-mirrored before drawing.
    let was_steep = Math.abs(qy - py) > Math.abs(qx - px);

    let [_px, _py, _qx, _qy] = [px, py, qx, qy]; // mirrored or flipped working coordinates

    // K: vector between near side and far side (line begin side, and line end side)
    let [kx, ky] = [rx - px, ry - py]; let [_kx, _ky] = [kx, ky];

    if (was_steep) { [_px, _py, _qx, _qy, _kx, _ky] = [_py, _px, _qy, _qx, _ky, _kx]; } // mirroring in x=y
    if (_px > _qx) { [_px, _py, _qx, _qy] = [_qx, _qy, _px, _py]; } // swapping p and q
    let [_dx, _dy] = [_qx - _px, _qy - _py];
    let _m = (_dx === 0) ? 1 : _dy / _dx;

    let [_rx, _ry, _sx, _sy] = [rx, ry, rx + (qx - px), ry + (qy - py)]; // mirrored or flipped working coordinates


    const plotNextLine = ([_Nx, _Ny]: number[]) => {
      // N : near point
      // M: far point
      let [_Mx, _My] = [_Nx + _kx, _Ny + _ky]
      let [Nx, Ny, Mx, My] = was_steep ? [_Ny, _Nx, _My, _Mx] : [_Nx, _Ny, _Mx, _My];
      this.putLine(print, printArea, [Nx, Ny], [Mx, My],  color)
    }


    // paint p
    let _px_Q = Num.round(_px), _py_Q = Num.integerPart(_py + _m * (_px_Q - _px))
    plotNextLine([_px_Q, _py_Q]);

    // paint q
    let _qx_Q = Num.round(_qx), _qy_Q = Num.integerPart(_qy + _m * (_qx_Q - _qx))
    plotNextLine([_qx_Q, _qy_Q]);

    let _dolly_y = _py + _m;
    let _dolly_y_Q = Num.integerPart(_dolly_y);

    for (var _dolly_x_Q = _px_Q + 1; _dolly_x_Q < _qx_Q; _dolly_x_Q++) {
      plotNextLine([_dolly_x_Q, _dolly_y_Q]);
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
