import Vector from '@IFS/math/linearAlgebra/vector';
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
    }
    this.displayRegion = this.calculateNewRegion(subjectCenter, subjectRadius);
  }



  calculateNewRegion = (subjectCenter: number[], subjectRadius: number): IRegion => {
    let outRadius = Math.min(this.outSpace.height, this.outSpace.width) / 2;
    this.pixPerUnit = outRadius / subjectRadius;
    let displayRect = this.outSpace.scale(1 / this.pixPerUnit);
    return {
      center: subjectCenter,
      topLeft: Vector.add(
        subjectCenter,
        [-displayRect.width / 2, displayRect.height / 2]
      ),
      displayRadius: subjectRadius,
      width: displayRect.width,
      height: displayRect.height
    };
  }

  pan = (posChange: number[]): void => {
    let newCenter = Vector.add(this.displayRegion.center, posChange);
    this.displayRegion = this.calculateNewRegion(newCenter, this.displayRegion.displayRadius);
  }

  project = (refPos: number[]): number[] => {
    let upsideDown = Vector.scale(
      Vector.minus(refPos, this.displayRegion.topLeft),
      this.pixPerUnit
    )
    let canvasPos = [upsideDown[0], -upsideDown[1]];
    // console.log(`projected point '${refPos}' to '${canvasPos}'`)
    return canvasPos;
  }

  changeRadius = (newRad: number): void => {
    this.displayRegion = this.calculateNewRegion(this.displayRegion.center, newRad);
  }

}

interface IRegion {
  topLeft: number[],
  center: number[],
  displayRadius: number,
  width: number,
  height: number,
}
