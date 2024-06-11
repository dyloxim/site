import Vec2 from '@IFS/math/linearAlgebra/vec2';
import I_DisplayParams from '@IFS/types/I_displayParams';
import Rect from "./rect";

export default class Rig {

  displayRegion: IRegion;

  constructor(displayParams: I_DisplayParams, outSpace: Rect) {
    this.displayRegion = this.calculateRegion(displayParams, outSpace);
  }

  recalibrate = (displayParams: I_DisplayParams, outSpace: Rect): void => {
    this.displayRegion = this.calculateRegion(displayParams, outSpace);
  }

  calculateRegion = (displayParams: I_DisplayParams, outSpace: Rect): IRegion => {
    let pixPerUnit = displayParams.pixPerUnit;
    let displayDims = outSpace.scale(1 / pixPerUnit);
    return this.displayRegion = {
      topLeft: Vec2.add(
        displayParams.displayRegion.origin,
        [-displayDims.width / 2, displayDims.height / 2]
      ),
      width: displayDims.width,
      height: displayDims.height
    };
  }

  project = (refPos: number[], pixPerUnit: number): number[] => {
    let upsideDown = Vec2.scale(
      Vec2.minus(refPos, this.displayRegion.topLeft),
      pixPerUnit
    )
    // let newPos = [upsideDown[0], -upsideDown[1]]; 
    // console.log(`point '${refPos}' projected to '${newPos}'`)
    return [upsideDown[0], -upsideDown[1]];
  }

}

interface IRegion {
  topLeft: number[],
  width: number,
  height: number
}
