import WorkPiece from "./artSupplies/workPiece";
import Color from './artSupplies/color';
import Rect from './artSupplies/rect';
import Rig from './artSupplies/rig';

export default class Painter {

  rig: Rig;
  canvas: WorkPiece;

  constructor(rig: Rig, workPiece: WorkPiece) {
    this.rig = rig;
    this.canvas = workPiece;
  }

  static defaultSetup(canvas: HTMLCanvasElement) {
    return new Painter(
      new Rig(new Rect(canvas.width, canvas.height), [0,0], 10),
      new WorkPiece(canvas.width, canvas.height, canvas)
    );
  }

  draftPoint = (refPos: number[], color: Color): void => {
    this.canvas.putPixel_quantize(this.rig.project(refPos), color)
  }

  draftLine = (refStart: number[], refEnd: number[], color: Color): void => {
    this.canvas.putLine(this.rig.project(refStart), this.rig.project(refEnd), color);
  }

}
