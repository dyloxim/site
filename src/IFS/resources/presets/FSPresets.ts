import { I_functionSystem } from "@IFS/types/configTypes";

export const barnsleyFern: I_functionSystem = {
  transforms: [
    { linear: [[0, 0], [0, 0.16]] },
    { linear: [[0.85, -0.04], [0.04, 0.85]], translation: [0, 1.6] },
    { linear: [[0.2, 0.23], [-0.26, 0.22]], translation: [0, 1.6] },
    { linear: [[-0.15, 0.26], [0.28, 0.24]], translation: [0, 0.44] }
  ],
  weights: [0.01, 0.85, 0.07, 0.07],
  referenceRegion: {
    corner: [0,0],
    e1: [3,0],
    e2: [0,10]
  },
  firstPoint: [0,0]
}

export const koch: I_functionSystem = {
  transforms: [
    { linear: [[1/3, 0],[0,1/3]] },
    { linear: [[1/2, 0.866025],[-0.866025,1/2]] },
    { translation: [1/Math.sqrt(2), 2] },
  ],
  weights: 'uniform',
  referenceRegion: {
    corner: [0,0],
    e1: [1,0],
    e2: [0,1]
  },
  firstPoint: [0, 0],
}

export const binaryTree: I_functionSystem = {
  transforms: [
    { linear: [[0.00, 0.00],[-0.00, 0.455]] },
    { linear: [[0.42, 0.42],[-0.42, 0.42]], translation: [ 0.0, 0.4]},
    { linear: [[0.42,-0.42],[ 0.42, 0.42]], translation: [ 0.0, 0.4]},
  ],
  weights: [1/5,2/5,2/5],
  referenceRegion: {
    corner: [-0.4, 0],
    e1: [.8,0],
    e2: [0,.8]
  },
  firstPoint: [0, 0]
}
