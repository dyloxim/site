import Rect from "./rect";

export default class WorkPiece {
  outerDims: number[];
  DOMElement: HTMLCanvasElement;
  renderContext: CanvasRenderingContext2D;
  outSpace: Rect;
  draft: ImageData;

  constructor(canvas: HTMLCanvasElement, outSpace: Rect) {
    this.DOMElement = canvas;
    this.outerDims = [canvas.width, canvas.height];
    this.renderContext = this.DOMElement.getContext('2d')!;
    this.outSpace = outSpace;
    this.draft = new ImageData(this.outSpace.width, this.outSpace.height);
    this.commitChanges();
  }

  getImgData = (sx: number, sy: number, sw: number, sh: number): ImageData => {
    return this.renderContext.getImageData(sx, sy, sw, sh);
  }

  commitChanges = (): void => {
    this.renderContext.putImageData(this.draft, 0, 0)
  }

  startOver = (outSpace: Rect): void => {
    this.outSpace = outSpace;
    this.DOMElement.width = this.outSpace.width;
    this.DOMElement.height = this.outSpace.height
    this.draft = new ImageData(this.outSpace.width, this.outSpace.height);
    this.commitChanges()
  }

  clear = (): void => {
    this.renderContext.clearRect(0,0, this.outSpace.width, this.outSpace.height);
    this.draft = this.renderContext.getImageData(0, 0, this.outSpace.width, this.outSpace.height);
  }

}
