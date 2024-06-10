import WorkPiece from "./workPiece";
import Painter from "./painter";
import Rig from "./rig";
import Color from "./color";
import Rect from "./rect";
import I_DisplayParams from "@IFS/types/I_displayParams";
import Vector from "@IFS/math/linearAlgebra/vector"

export default class Apperatus {

  rig: Rig;

  workPiece: WorkPiece;

  displayParams: I_DisplayParams;

  constructor(canvas: HTMLCanvasElement, displayParams: I_DisplayParams) {
    this.workPiece = new WorkPiece(canvas);
    this.displayParams = displayParams;
    let outSpace = new Rect(canvas.width, canvas.height);
    let displayOrigin = displayParams.displayRegion.origin;
    let displayRadius = displayParams.displayRegion.displayRadius;
    this.rig = new Rig(outSpace, displayOrigin, displayRadius); 
  }

  addPoint = (p: number[], color: Color): void => {
    Painter.putPixel_quantize(this.workPiece, this.rig.project(p), color)
  }

  addLine = (p: number[], q: number[], color: Color): void => {
    Painter.putLine(this.workPiece, this.rig.project(p), this.rig.project(q), color);
  }

  moveFocus = (change: number[]): void => {
    let originalPos = this.displayParams.displayRegion.origin;
    this.displayParams.displayRegion.origin = Vector.add(originalPos, change);
    this.rig.pan(change);
    this.workPiece.clear();
  }

  zoom = (zoomFactor: number): void => {
    let currentRad = this.rig.displayRegion.displayRadius;
    let newRad = currentRad / zoomFactor;
    this.displayParams.displayRegion.displayRadius = newRad;
    this.rig.changeRadius(newRad);
    this.workPiece.clear()
  }

  update = () => {
    this.workPiece.commitChanges();
  }

}
