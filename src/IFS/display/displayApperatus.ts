import WorkPiece from "./workPiece";
import Painter from "./painter";
import Rig from './rig';
import Color from "./color";
import Rect from "./rect";
import I_DisplayParams from "@IFS/types/I_displayParams";
import Vector from "@IFS/math/linearAlgebra/vector"

export default class DisplayApperatus {

  rig: Rig;

  workPiece: WorkPiece;

  outSpace: Rect;

  params: I_DisplayParams;

  constructor(canvas: HTMLCanvasElement, params: I_DisplayParams) {
    this.params = params;
    canvas.style.width = `${canvas.width}` + 'px'
    canvas.style.height = `${canvas.height}` + 'px'
    let outRadius = Math.min(canvas.width, canvas.height);
    let displayRadius = this.params.displayRegion.displayRadius;
    let upScaleFactor = this.params.pixPerUnit / (outRadius / displayRadius);
    this.outSpace = new Rect(canvas.width, canvas.height)
      .scale(upScaleFactor);
    this.workPiece = new WorkPiece(canvas, this.outSpace);
    this.rig = new Rig(this.params, this.outSpace);
    this.setResolution(this.params.pixPerUnit);
  }

  projectedPoint = (p: number[]): number[] => {
    return this.rig.project(p, this.params.pixPerUnit);
  }

  addPoint = (p: number[], color: Color): void => {
    let _p = this.projectedPoint(p)
    Painter.putPixel_quantize(this.workPiece, this.outSpace, _p, color)
  }

  addLine = (p: number[], q: number[], color: Color): void => {
    let _p = this.projectedPoint(p)
    let _q = this.projectedPoint(q)
    Painter.putLine(this.workPiece, this.outSpace, _p, _q, color);
  }

  update = () => {
    this.workPiece.commitChanges();
  }

  getUpscaleFactor = (): number => {
    // workpiece height / width are set to the canvas base dimensions and do not change
    let outRadius = Math.min(...this.workPiece.outerDims);
    let displayRadius = this.params.displayRegion.displayRadius
    return this.params.pixPerUnit / (outRadius / displayRadius)
  }

  

  setResolution = (pixPerUnit: number): void => {
    this.params.pixPerUnit = pixPerUnit;
    this.outSpace = new Rect(...this.workPiece.outerDims)
      .scale(this.getUpscaleFactor());
    this.outSpace.width = Math.round(this.outSpace.width);
    this.outSpace.height = Math.round(this.outSpace.height);
    this.applyConfig();
  }

  pan = (x: number, y: number): void => {
    let originalPos = this.params.displayRegion.origin;
    this.params.displayRegion.origin = Vector.add(originalPos, [x, y]);
    this.rig.recalibrate(this.params, this.outSpace);
    this.applyConfig();
  }

  zoom = (scaleFactor: number): void => {
    let currentRad = this.params.displayRegion.displayRadius;
    let newRad = currentRad / scaleFactor;
    this.params.displayRegion.displayRadius = newRad;
    this.outSpace = this.outSpace.scale(1/scaleFactor);
    this.outSpace.width = Math.min(3000, Math.max(2, Math.round(this.outSpace.width)));
    this.outSpace.height = Math.min(3000, Math.max(2, Math.round(this.outSpace.height)));
    this.applyConfig();
  }

  applyConfig = (): void => {
    this.rig.recalibrate(this.params, this.outSpace);
    this.workPiece.startOver(this.outSpace);
  }

}
