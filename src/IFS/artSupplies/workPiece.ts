import Rect from "./rect";
import Color from "./color";
import Num from '../numerical/num'

export default class WorkPiece extends Rect {
  DOMElement: HTMLCanvasElement;
  renderContext: CanvasRenderingContext2D;
  imgData: ImageData;

  constructor(width: number, height: number, element: HTMLCanvasElement) {
    super(height, width);
    this.DOMElement = element;
    this.DOMElement.height = this.height;
    this.DOMElement.width = this.width;
    this.renderContext = this.DOMElement.getContext('2d')!;
    this.imgData = new ImageData(width, height);
    this.show();
  }

  getImgData = (sx: number, sy: number, sw: number, sh: number): ImageData => {
    return this.renderContext.getImageData(sx, sy, sw, sh);
  }

  putPixel = (pos: number[], color: Color) => {
    if (this.isVisible(pos)) {
      const index = 4 * (pos[1] * this.width + pos[0]);
      this.imgData.data[index + 0] = color.r;
      this.imgData.data[index + 1] = color.g;
      this.imgData.data[index + 2] = color.b;
      this.imgData.data[index + 3] = color.a;
    }
  }

  isVisible = (pos: number[]): boolean => {
    return (pos[0] > 0 && pos[0] < this.width && pos[1] > 0 && pos[1] < this.height)
  }

  putPixel_quantize = (pos: number[], color: Color) => {
    if (this.isVisible(pos)) {
      let pos_Q = pos.map(a => Math.round(a));
      const index = 4 * (pos_Q[1] * this.width + pos_Q[0]);
      this.imgData.data[index + 0] = color.r;
      this.imgData.data[index + 1] = color.g;
      this.imgData.data[index + 2] = color.b;
      this.imgData.data[index + 3] = color.a;
    }
  }

  putLine = ([px, py]: number[], [qx, qy]: number[], color: Color) => {

    let was_steep = Math.abs(qy - py) > Math.abs(qx - px);

    let [_px, _py, _qx, _qy] = [px, py, qx, qy]; // potentially mirrored or flipped p & coordinates
    if (was_steep) { [_px, _py, _qx, _qy] = [py, px, qy, qx]; } // mirroring in x=y
    if (_px > _qx) { [_px, _py, _qx, _qy] = [_qx, _qy, _px, _py]; } // swapping p and q
    let [_dx, _dy] = [_qx - _px, _qy - _py];
    let _m = (_dx === 0) ? 1 : _dy / _dx;

    // paint p
    let _px_Q = Num.round(_px), _py_Q = Num.integerPart(_py + _m * (_px_Q - _px))
    this.putPixel(was_steep ? [_py_Q, _px_Q] : [_px_Q, _py_Q], color)

    // paint q
    let _qx_Q = Num.round(_qx), _qy_Q = Num.integerPart(_qy + _m * (_qx_Q - _qx))
    this.putPixel(was_steep ? [_qy_Q, _qx_Q] : [_qx_Q, _qy_Q], color)

    let _dolly_y = _py + _m;
    let _dolly_y_Q = Num.integerPart(_dolly_y);

    // joint together
    console.log(`drawing line between pixels with x coordinates '[${_px}, ${_py}]', and '[${_qx}, ${_qy}]'`)
    console.log(`gradient is '${_m}'`);
    for (var _dolly_x_Q = _px_Q + 1; _dolly_x_Q < _qx_Q; _dolly_x_Q++) {
      this.putPixel(was_steep ? [_dolly_y_Q, _dolly_x_Q] : [_dolly_x_Q, _dolly_y_Q], color);
      _dolly_y = _dolly_y + _m;
      _dolly_y_Q = Num.integerPart(_dolly_y)
    }
  }

  show = (): void => {
    this.renderContext.putImageData(this.imgData, 0, 0)
  }

}
