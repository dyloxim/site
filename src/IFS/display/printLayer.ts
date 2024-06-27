import Rect from "./util/rect";
import Color from "./util/color";

export default class PrintLayer {

  name: string;
  material: HTMLCanvasElement;
  workPiece: CanvasRenderingContext2D;
  draft: ImageData;

  constructor(name: string, canvas: HTMLCanvasElement, printArea: Rect) {
    this.name = name;
    this.material = canvas;
    this.workPiece = this.material.getContext('2d')!;
    this.material.width = printArea.width;
    this.material.height = printArea.height;
    this.draft = new ImageData(printArea.width, printArea.height);
  }

  reconstruct = (printArea: Rect) => {
    this.material.width = printArea.width;
    this.material.height = printArea.height;
    this.draft = new ImageData(printArea.width, printArea.height);
    this.clear()
  }

  mark = (index: number, color: Color) => {
    this.draft.data[index + 0] = color.r;
    this.draft.data[index + 1] = color.g;
    this.draft.data[index + 2] = color.b;
    this.draft.data[index + 3] = color.a;
  }

  commit = (): void => {
    this.workPiece!.putImageData(this.draft!, 0, 0)
  }

  isPlate = (): boolean => (Number(this.material.style.zIndex) == 1)

  clear = (): void => {
    this.draft = new ImageData(this.material.width, this.material.height);
    this.workPiece.clearRect(0,0, this.material.width, this.material.height);
    this.commit()
  }

}
