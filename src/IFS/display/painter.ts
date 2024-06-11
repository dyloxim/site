import WorkPiece from "./workPiece";
import Color from './color';
import Rect from "./rect";
import Num from "@IFS/math/numerical/num";

export default class Painter {

  static isVisible(outSpace: Rect, pos: number[]): boolean {
    // console.log(`attempting to plot point '${pos}' (indicies would start at '${4 * (pos[1] * outSpace.width + pos[0])}')`)
    return (pos[0] > 0 && pos[0] < outSpace.width && pos[1] > 0 && pos[1] < outSpace.height)
  }

  static putPixel(workPiece: WorkPiece, outSpace: Rect, pos: number[], color: Color): void {
    if (this.isVisible(outSpace, pos)) {
      // console.log("point visible, plotting");
      const index = 4 * (pos[1] * outSpace.width + pos[0]);
      workPiece.draft.data[index + 0] = color.r;
      workPiece.draft.data[index + 1] = color.g;
      workPiece.draft.data[index + 2] = color.b;
      workPiece.draft.data[index + 3] = color.a;
    } else {
      // console.log("point not visible")
    }
  }

  static putPixel_quantize(workPiece: WorkPiece, outSpace: Rect, pos: number[], color: Color): void {
    let pos_Q = pos.map(a => Math.round(a));
    if (this.isVisible(outSpace, pos_Q)) {
      // console.log("point visible, plotting");
      const index = 4 * (pos_Q[1] * outSpace.width + pos_Q[0]);
      workPiece.draft.data[index + 0] = color.r;
      workPiece.draft.data[index + 1] = color.g;
      workPiece.draft.data[index + 2] = color.b;
      workPiece.draft.data[index + 3] = color.a;
    } else {
      // console.log("point not visible")
    }
  }

  static putLine(workPiece: WorkPiece, outSpace: Rect, [px, py]: number[], [qx, qy]: number[], color: Color) {

    let was_steep = Math.abs(qy - py) > Math.abs(qx - px);

    let [_px, _py, _qx, _qy] = [px, py, qx, qy]; // potentially mirrored or flipped p & coordinates
    if (was_steep) { [_px, _py, _qx, _qy] = [py, px, qy, qx]; } // mirroring in x=y
    if (_px > _qx) { [_px, _py, _qx, _qy] = [_qx, _qy, _px, _py]; } // swapping p and q
    let [_dx, _dy] = [_qx - _px, _qy - _py];
    let _m = (_dx === 0) ? 1 : _dy / _dx;

    // paint p
    let _px_Q = Num.round(_px), _py_Q = Num.integerPart(_py + _m * (_px_Q - _px))
    this.putPixel(workPiece, outSpace, was_steep ? [_py_Q, _px_Q] : [_px_Q, _py_Q], color)

    // paint q
    let _qx_Q = Num.round(_qx), _qy_Q = Num.integerPart(_qy + _m * (_qx_Q - _qx))
    this.putPixel(workPiece, outSpace, was_steep ? [_qy_Q, _qx_Q] : [_qx_Q, _qy_Q], color)

    let _dolly_y = _py + _m;
    let _dolly_y_Q = Num.integerPart(_dolly_y);

    // joint together
    // console.log(`drawing line between pixels with x coordinates '[${_px}, ${_py}]', and '[${_qx}, ${_qy}]'`)
    // console.log(`gradient is '${_m}'`);
    for (var _dolly_x_Q = _px_Q + 1; _dolly_x_Q < _qx_Q; _dolly_x_Q++) {
      this.putPixel(workPiece, outSpace, was_steep ? [_dolly_y_Q, _dolly_x_Q] : [_dolly_x_Q, _dolly_y_Q], color);
      _dolly_y = _dolly_y + _m;
      _dolly_y_Q = Num.integerPart(_dolly_y)
    }
  }

}
