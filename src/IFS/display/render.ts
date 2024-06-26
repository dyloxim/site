import Rect from "./rect";
import I_displayConfig from "@IFS/types/I_displayConfig"

export default class Render {

  material: HTMLCanvasElement;
  workPiece: CanvasRenderingContext2D;
  draft: ImageData;

  borderRect: Rect;
  printArea: Rect;

  constructor(config: I_displayConfig, canvas: HTMLCanvasElement) {

    this.material = canvas;
    this.workPiece = this.material.getContext('2d')!;

    if (this.material.style.width) {
      this.borderRect = new Rect(
        Number(this.material.style.width.replace(/([0-9]+)px/, '$1')),
        Number(this.material.style.height.replace(/([0-9]+)px/, '$1'))
      )
    } else {
      this.material.style.width = `${this.material.width}` + 'px'
      this.material.style.height = `${this.material.height}` + 'px'
      this.borderRect = new Rect(canvas.width, canvas.height);
    }
    this.printArea = this.borderRect.scale(config.rendering.upscaleFactor)
      .nearestWholeNumberDimensions();

    this.material.width = this.printArea.width;
    this.material.height = this.printArea.height;
    this.draft = new ImageData(this.printArea.width, this.printArea.height);
    this.commitChanges();

  }

  reconstruct = (config: I_displayConfig): void => {
    this.printArea = this.borderRect.scale(config.rendering.upscaleFactor)
      .nearestWholeNumberDimensions();
    this.material.width = this.printArea.width;
    this.material.height = this.printArea.height;
    this.draft = new ImageData(this.printArea.width, this.printArea.height);
    this.commitChanges();
  }

  getPrintArea = () => {
    return this.printArea;
  }

  getWorkpiece = (): ImageData => {
    return this.workPiece!.getImageData(0, 0, this.printArea.width, this.printArea.height);
  }

  commitChanges = (): void => {
    this.workPiece!.putImageData(this.draft!, 0, 0)
  }

  // clear = (): void => {
  //   this.workPiece.clearRect(0,0, this.printArea.width, this.printArea.height);
  //   this.draft = this.getWorkpiece();
  // }


  // setPrintArea = (outSpace: Rect): void => {
  //   this.printArea = outSpace;
  //   [this.material.width, this.material.height] = this.printArea.dims();
  //   this.draft = new ImageData(this.printArea.width, this.printArea.height);
  //   this.commitChanges()
  // }

}
