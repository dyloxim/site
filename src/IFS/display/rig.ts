import { default as Vec } from '@IFS/math/linearAlgebra/vec2';
import { I_displayConfig } from '@IFS/types/configTypes';
import Rect from "./util/rect";

export default class Rig {

  domain: I_domainIntern;

  // Rigging calculation functions

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

    /*  When this function is used
     *      --------------------------
     *
     *  at startup we want the display to centre on the produced image and we want
     *  this variable 'appropriate-region-to-view-whole-image' to be a property
     *  of the function system definition, not the initial display parameters.
     *
     *  This means at initialization we need to use the reference region defined
     *  on the function system to calculate the display region.
     *
     *  Sometimes however, we /do/ want to specify a display region to use at startup
     *  which is not an overview of the whole image.
     *
     *  To distinguish these cases, we specify that a display region defined with
     *  a ZERO display radius implies the fallback 'use the function system reference-
     *  - region'
     *
     */

    if (displayRegion.displayRadius == 0) {

      /*
       *  we calculate the implied display region as having its centre at the intersection
       *  of the refernce region's diagonals, and to have a radius equal to half of the
       *  longest diagonal
       *
       */
      
      let diag1 = Vec.add(refRegion.e1, refRegion.e2);
      let diag2 = Vec.add(Vec.scale(refRegion.e1, -1), refRegion.e2);
      let newDisplayRegion =
        {
          origin: Vec.add(refRegion.corner, Vec.scale(diag1, 1 / 2)),
          displayRadius: Math.max(...[diag1, diag2].map(v => Vec.mod(v))) / 2
        }
      
      return newDisplayRegion;

    } else return displayRegion;

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


  // setup this rig

  constructor(config: I_displayConfig, printArea: Rect) {
    let domain = Rig.determineDomain(config, printArea);
    this.domain = domain;
  }

  reconstruct = (config: I_displayConfig, printArea: Rect) => {
    let domain = Rig.determineDomain(config, printArea);
    this.domain = domain;
  }


  /*  
   *  The project(..) function is the main purpose of the rig;
   *
   *  it takes points in the maths domain and projects them to the
   *  canvas pixel range.
   *
   */ 

  projectPoint = (printWidth: number, p: number[]): number[] => {
    let pixPerUnit = printWidth / this.domain.width;
    let upsideDown = Vec.scale(
      Vec.minus(p, this.domain.topLeft),
      pixPerUnit
    );
    return [upsideDown[0], -upsideDown[1]];
  };

  projectPoints = (printWidth: number, ...points: number[][]): number[][] => {
    return points.map(p => {
    let pixPerUnit = printWidth / this.domain.width;
    let upsideDown = Vec.scale(
      Vec.minus(p, this.domain.topLeft),
      pixPerUnit
    );
    return [upsideDown[0], -upsideDown[1]];
    })
  };

}

interface I_domainIntern {
  centre: number[],
  topLeft: number[],
  width: number,
  height: number
}
