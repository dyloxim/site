import I_Preset from "@IFS/types/I_preset"
import Linear from "@IFS/math/linearAlgebra/linear"
import Affine from "@IFS/math/linearAlgebra/affine"
import * as Colors from "@IFS/resources/colors"

export const barnsleyFern: I_Preset = {
  firstPoint: [0, 0],
  functionSystem: {
    transforms: [
      new Linear([0.00, 0.00], [0.00, 0.16]),
      new Affine([[0.85, -0.04], [0.04, 0.85]], [0.00, 1.60]),
      new Affine([[0.20, 0.23], [-0.26, 0.22]], [0.00, 1.60]),
      new Affine([[-0.15, 0.26], [0.28, 0.24]], [0.00, 0.44])
    ],
    weights: [0.01, 0.85, 0.07, 0.07]
  },
  displayParams: {
    displayRegion: {
      origin: [0, 0],
      displayRadius: 4
    },
    baseColor: Colors.White
  }
}
