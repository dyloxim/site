import WorkPiece from "./workPiece";
import Color from './color';
import Num from "@IFS/math/numerical/num";

export default class Painter {

  static isVisible(canvas: WorkPiece, pos: number[]): boolean {
    return (pos[0] > 0 && pos[0] < canvas.width && pos[1] > 0 && pos[1] < canvas.height)
  }

  static putPixel(canvas: WorkPiece, pos: number[], color: Color): void {
    if (this.isVisible(canvas, pos)) {
      const index = 4 * (pos[1] * canvas.width + pos[0]);
      canvas.draft.data[index + 0] = color.r;
      canvas.draft.data[index + 1] = color.g;
      canvas.draft.data[index + 2] = color.b;
      canvas.draft.data[index + 3] = color.a;
    }
  }

  static putPixel_quantize(canvas: WorkPiece, pos: number[], color: Color): void {
    // console.log(`pos is `)
    if (this.isVisible(canvas, pos)) {
      let pos_Q = pos.map(a => Math.round(a));
      const index = 4 * (pos_Q[1] * canvas.width + pos_Q[0]);
      canvas.draft.data[index + 0] = color.r;
      canvas.draft.data[index + 1] = color.g;
      canvas.draft.data[index + 2] = color.b;
      canvas.draft.data[index + 3] = color.a;
    }
  }

  static putLine(canvas: WorkPiece, [px, py]: number[], [qx, qy]: number[], color: Color) {

    let was_steep = Math.abs(qy - py) > Math.abs(qx - px);

    let [_px, _py, _qx, _qy] = [px, py, qx, qy]; // potentially mirrored or flipped p & coordinates
    if (was_steep) { [_px, _py, _qx, _qy] = [py, px, qy, qx]; } // mirroring in x=y
    if (_px > _qx) { [_px, _py, _qx, _qy] = [_qx, _qy, _px, _py]; } // swapping p and q
    let [_dx, _dy] = [_qx - _px, _qy - _py];
    let _m = (_dx === 0) ? 1 : _dy / _dx;

    // paint p
    let _px_Q = Num.round(_px), _py_Q = Num.integerPart(_py + _m * (_px_Q - _px))
    this.putPixel(canvas, was_steep ? [_py_Q, _px_Q] : [_px_Q, _py_Q], color)

    // paint q
    let _qx_Q = Num.round(_qx), _qy_Q = Num.integerPart(_qy + _m * (_qx_Q - _qx))
    this.putPixel(canvas, was_steep ? [_qy_Q, _qx_Q] : [_qx_Q, _qy_Q], color)

    let _dolly_y = _py + _m;
    let _dolly_y_Q = Num.integerPart(_dolly_y);

    // joint together
    // console.log(`drawing line between pixels with x coordinates '[${_px}, ${_py}]', and '[${_qx}, ${_qy}]'`)
    // console.log(`gradient is '${_m}'`);
    for (var _dolly_x_Q = _px_Q + 1; _dolly_x_Q < _qx_Q; _dolly_x_Q++) {
      this.putPixel(canvas, was_steep ? [_dolly_y_Q, _dolly_x_Q] : [_dolly_x_Q, _dolly_y_Q], color);
      _dolly_y = _dolly_y + _m;
      _dolly_y_Q = Num.integerPart(_dolly_y)
    }
  }

}
