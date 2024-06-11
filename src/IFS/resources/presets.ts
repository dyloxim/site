import I_Preset from "@IFS/types/I_preset"
import Linear from "@IFS/math/linearAlgebra/lin2x2"
import Translation from "@IFS/math/linearAlgebra/trans2"
import Affine from "@IFS/math/linearAlgebra/affine"
import * as Colors from "@IFS/resources/colors"
import * as Palettes from "@IFS/resources/palettes"

export const barnsleyFern: I_Preset = {
  firstPoint: [0, 0],
  functionSystem: {
    transforms: [
      new Linear([0.00, 0.00], [0.00, 0.16]),
      new Affine(new Linear([0.85, -0.04], [0.04, 0.85]), new Translation(0.00, 1.60)),
      new Affine(new Linear([0.20, 0.23], [-0.26, 0.22]), new Translation(0.00, 1.60)),
      new Affine(new Linear([-0.15, 0.26], [0.28, 0.24]), new Translation(0.00, 0.44))
    ],
    weights: [0.01, 0.85, 0.07, 0.07]
  },
  displayParams: {
    displayRegion: {
      origin: [0, 0],
      displayRadius: 4
    },
    baseColor: Colors.White,
    palette: Palettes.Primary,
    useColor: true,
    pixPerUnit: 10
  }
}

export const koch: I_Preset = {
  firstPoint: [0, 0],
  functionSystem: {
    transforms: [
    new Linear([1/3, 0],[0,1/3]),
    new Linear([1/2, 0.866025],[-0.866025,1/2]),
    new Translation(1/Math.sqrt(2), 2),
    ],
    weights: 'uniform'
  },
  displayParams: {
    displayRegion: {
      origin: [0, 0],
      displayRadius: 4
    },
    baseColor: Colors.White,
    palette: Palettes.Primary,
    useColor: true,
    pixPerUnit: 10
  }
}
