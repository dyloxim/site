import Render from "./render";
import Color from './color';
import Rect from "./rect";
import Num from "@IFS/math/numerical/num";

export default class Painter {

  static isVisible(outSpace: Rect, pos: number[]): boolean {
    return (pos[0] > 0 && pos[0] < outSpace.width && pos[1] > 0 && pos[1] < outSpace.height)
  }

  static putPixel(render: Render, pos: number[], color: Color): void {
    if (this.isVisible(render.printArea, pos)) {
      const index = 4 * (pos[1] * render.printArea.width + pos[0]);
      render.draft.data[index + 0] = color.r;
      render.draft.data[index + 1] = color.g;
      render.draft.data[index + 2] = color.b;
      render.draft.data[index + 3] = color.a;
    } else {
    }
  }

  static putPixel_quantize(render: Render, pos: number[], color: Color): void {
    let pos_Q = pos.map(a => Math.round(a));
    if (this.isVisible(render.printArea, pos_Q)) {
      const index = 4 * (pos_Q[1] * render.printArea.width + pos_Q[0]);
      render.draft.data[index + 0] = color.r;
      render.draft.data[index + 1] = color.g;
      render.draft.data[index + 2] = color.b;
      render.draft.data[index + 3] = color.a;
    } else {
    }
  }

  static putLine(render: Render, [px, py]: number[], [qx, qy]: number[], color: Color) {

    let was_steep = Math.abs(qy - py) > Math.abs(qx - px);

    let [_px, _py, _qx, _qy] = [px, py, qx, qy]; // mirrored or flipped working coordinates
    if (was_steep) { [_px, _py, _qx, _qy] = [py, px, qy, qx]; } // mirroring in x=y
    if (_px > _qx) { [_px, _py, _qx, _qy] = [_qx, _qy, _px, _py]; } // swapping p and q
    let [_dx, _dy] = [_qx - _px, _qy - _py];
    let _m = (_dx === 0) ? 1 : _dy / _dx;

    // paint p
    let _px_Q = Num.round(_px), _py_Q = Num.integerPart(_py + _m * (_px_Q - _px))
    this.putPixel(render, was_steep ? [_py_Q, _px_Q] : [_px_Q, _py_Q], color)

    // paint q
    let _qx_Q = Num.round(_qx), _qy_Q = Num.integerPart(_qy + _m * (_qx_Q - _qx))
    this.putPixel(render, was_steep ? [_qy_Q, _qx_Q] : [_qx_Q, _qy_Q], color)

    let _dolly_y = _py + _m;
    let _dolly_y_Q = Num.integerPart(_dolly_y);

    // joint together
    // console.log(`drawing line between pixels with x coordinates '[${_px}, ${_py}]', and '[${_qx}, ${_qy}]'`)
    // console.log(`gradient is '${_m}'`);
    for (var _dolly_x_Q = _px_Q + 1; _dolly_x_Q < _qx_Q; _dolly_x_Q++) {
      this.putPixel(render, was_steep ? [_dolly_y_Q, _dolly_x_Q] : [_dolly_x_Q, _dolly_y_Q], color);
      _dolly_y = _dolly_y + _m;
      _dolly_y_Q = Num.integerPart(_dolly_y)
    }
  }

}
