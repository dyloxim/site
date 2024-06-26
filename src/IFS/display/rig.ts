import Vec2 from '@IFS/math/linearAlgebra/vec2';
import I_displayConfig from '@IFS/types/I_displayConfig';
import Rect from "./rect";

export default class Rig {

  static calculateRange = (borderRect: Rect, upscaleFactor: number): Rect => {
    return borderRect.scale(upscaleFactor)
      .nearestWholeNumberDimensions();
  }

  private static calculateDomain = (config: I_displayConfig, outSpace: Rect): I_domainIntern => {
    let pixPerUnit = Math.min(...outSpace.scale(1 / 2).dims()) / config.domain.displayRadius;
    let domainRect = outSpace.scale(1 / pixPerUnit);
    return {
      centre: config.domain.origin,
      topLeft: Vec2.add(
        config.domain.origin,
        [-domainRect.width / 2, domainRect.height / 2]
      ),
      width: domainRect.width,
      height: domainRect.height
    };
  };

  domain: I_domainIntern;

  constructor(config: I_displayConfig, printArea: Rect) {
    this.domain = Rig.calculateDomain(config, printArea);
  }

  reconstruct = (config: I_displayConfig, printArea: Rect) => {
    this.domain = Rig.calculateDomain(config, printArea);
  }

  project = (refPos: number[], printWidth: number): number[] => {

    let pixPerUnit = printWidth / this.domain.width;

    let upsideDown = Vec2.scale(
      Vec2.minus(refPos, this.domain.topLeft),
      pixPerUnit
    );
    return [upsideDown[0], -upsideDown[1]];
  };

}

interface I_domainIntern {
  centre: number[],
  topLeft: number[],
  width: number,
  height: number
}
