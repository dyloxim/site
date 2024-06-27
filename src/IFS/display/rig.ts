import { default as Vec } from '@IFS/math/linearAlgebra/vec2';
import { I_displayConfig } from '@IFS/types/configTypes';
import Rect from "./util/rect";

export default class Rig {

  static handlePossibleImpliedDisplayRegion = (
    refRegion: {
      corner: number[],
      e1: number[],
      e2: number[]
    },
    displayRegion: {
      origin: number[],
      displayRadius: number,
    }
  ) => {
    if (displayRegion.displayRadius == 0) {
      let diag1 = Vec.add(refRegion.e1, refRegion.e2);
      let diag2 = Vec.add(Vec.scale(refRegion.e1, -1), refRegion.e2);
      let newDisplayRegion = {
        origin: Vec.add(refRegion.corner, Vec.scale(diag1, 1/2)),
        displayRadius: Math.max(...[diag1, diag2].map(v => Vec.mod(v)))/2
      }
      return newDisplayRegion;
    } else {
      return displayRegion;
    }
  }

  static determineRange = (borderRect: Rect, upscaleFactor: number): Rect => {
    return borderRect.scale(upscaleFactor)
      .nearestWholeNumberDimensions();
  }

  private static determineDomain = (
    config: I_displayConfig,
    outSpace: Rect
  ): I_domainIntern => {
    let pixPerUnit = Math.min(...outSpace.scale(1 / 2).dims()) / config.domain.displayRadius;
    let domainRect = outSpace.scale(1 / pixPerUnit);
    return {
      centre: config.domain.origin,
      topLeft: Vec.add(
        config.domain.origin,
        [-domainRect.width / 2, domainRect.height / 2]
      ),
      width: domainRect.width,
      height: domainRect.height
    };
  };

  domain: I_domainIntern;

  constructor(config: I_displayConfig, printArea: Rect) {
    let domain = Rig.determineDomain(config, printArea);
    this.domain = domain;
  }

  reconstruct = (config: I_displayConfig, printArea: Rect) => {
    let domain = Rig.determineDomain(config, printArea);
    this.domain = domain;
  }

  project = (refPos: number[], printWidth: number): number[] => {

    let pixPerUnit = printWidth / this.domain.width;

    let upsideDown = Vec.scale(
      Vec.minus(refPos, this.domain.topLeft),
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
