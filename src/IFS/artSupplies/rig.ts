import Vector from '../linearAlgebra/vector';
import Rect from "./rect";

export default class Rig {

  displayRegion: IRegion;

  outSpace: Rect;

  pixPerUnit: number;

  constructor(outSpace: Rect, subjectCenter: number[], subjectRadius: number) {
    if (subjectCenter.length !== 2) {
      throw `Subject center must be a two dimensional vector. ('${subjectCenter}' provided)`;
    } else {
      this.outSpace = outSpace;
      let outRadius = Math.min(outSpace.height, outSpace.width) / 2;
      this.pixPerUnit = outRadius / subjectRadius;
      let displayRect = outSpace.scale(1 / this.pixPerUnit);
      this.displayRegion = {
        width: displayRect.width,
        height: displayRect.height,
        topLeft: Vector.add(
          subjectCenter,
          [-displayRect.width / 2, displayRect.height / 2]
        )
      };
    }
  }

  pan = (posChange: number[]): void => {
    this.displayRegion.topLeft = Vector.add(this.displayRegion.topLeft, posChange);
  }

  project = (refPos: number[]): number[] => {
    let upsideDown = Vector.scale(
      Vector.minus(refPos, this.displayRegion.topLeft),
      this.pixPerUnit
    )
    let canvasPos = [upsideDown[0], -upsideDown[1]];
    console.log(`projected point '${refPos}' to '${canvasPos}'`)
    return canvasPos;
  }

}

interface IRegion {
  topLeft: number[];
  width: number;
  height: number;
}
