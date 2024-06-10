import Rect from "./rect";

export default class WorkPiece extends Rect {
  DOMElement: HTMLCanvasElement;
  renderContext: CanvasRenderingContext2D;
  draft: ImageData;

  constructor(canvas: HTMLCanvasElement) {
    super(canvas.width, canvas.height);
    this.DOMElement = canvas;
    this.DOMElement.height = this.height;
    this.DOMElement.width = this.width;
    this.renderContext = this.DOMElement.getContext('2d')!;
    this.draft = new ImageData(canvas.width, canvas.height);
    this.commitChanges();
  }

  getImgData = (sx: number, sy: number, sw: number, sh: number): ImageData => {
    return this.renderContext.getImageData(sx, sy, sw, sh);
  }

  commitChanges = (): void => {
    this.renderContext.putImageData(this.draft, 0, 0)
  }

  clear = (): void => {
    this.draft = new ImageData(this.width, this.height);
    this.renderContext.clearRect(0,0, this.DOMElement.width, this.DOMElement.height);
  }

}
