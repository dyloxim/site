import { I_functionSystem } from "@IFS/types/configuration";
import { NamedFSPreset } from "@IFS/types/specifications";

export const FunctionSystems: Record<NamedFSPreset, I_functionSystem> = {

  a_heighwayDragon: {
    key: "heighwayDragon",
    name: "Heighway Dragon [2]",
    transforms: [
      { linear: [[1/2, 1/2],[-1/2, 1/2]] },
      { linear: [[-1/2, 1/2],[-1/2, -1/2]], translation: [1,0]},
    ],
    weights: 'uniform',
    referenceRegion: {
      o: [-0.33, -.33],
      e1: [1.50,0],
      e2: [0,1.0]
    },
    firstPoint: [0, 0]
  },
  

  b_binaryTree: {
    key: "binaryTree",
    name: "Binary Tree [3]",
    transforms: [
      { linear: [[0.00, 0.00],[-0.00, 0.455]] },
      { linear: [[0.42, 0.42],[-0.42, 0.42]], translation: [ 0.0, 0.4]},
      { linear: [[0.42,-0.42],[ 0.42, 0.42]], translation: [ 0.0, 0.4]},
    ],
    weights: [1/5,2/5,2/5],
    referenceRegion: {
      o: [-0.49, 0],
      e1: [0.98,0],
      e2: [0,0.88]
    },
    firstPoint: [0, 0]
  },


  b_colorSpace: {
    key: "colorSpace",
    name: "Color Space [3]",
    transforms: [
      { linear: [[8/9, 0],[0, 8/9]], translation: [-1, -.6]},
      { linear: [[-8/9, 0],[0, -8/9]], translation: [ 0, .6]},
      { linear: [[8/9, 0],[0, 8/9]], translation: [ 1, -.6]},
    ], weights: 'uniform',
    referenceRegion: {
      o: [-2,  -1.9],
      e1: [4,0],
      e2: [0,4]
    },
    firstPoint: [0, 0]
  },


  b_sierpinskiGasket: {
    key: "sierpinskiGasket",
    name: "Sierpinski Gasket [3]",
    transforms: [
      { linear: [[1/2, 0],[0, 1/2]] },
      { linear: [[ 1/2, 0],[0,  1/2]], translation: [1/2,0]},
      { linear: [[ 1/2, 0],[0,  1/2]], translation: [1/4,Math.sqrt(3)/4]},
    ],
    weights: 'uniform',
    referenceRegion: {
      o: [0, 0],
      e1: [0.98,0],
      e2: [0,0.88]
    },
    firstPoint: [0, 0]
  },


  c_barnsleyFern: {
    key: "barnsleyFern",
    name: "Barnsley Fern [4]",
    transforms: [
      { linear: [[0, 0], [0, 0.16]] },
      { linear: [[0.85, -0.04], [0.04, 0.85]], translation: [0, 1.6] },
      { linear: [[0.2, 0.23], [-0.26, 0.22]], translation: [0, 1.6] },
      { linear: [[-0.15, 0.26], [0.28, 0.24]], translation: [0, 0.44] }
    ],
    weights: [0.01, 0.85, 0.07, 0.07],
    referenceRegion: {
      o: [-2.24,0],
      e1: [4.95,0],
      e2: [0,10.05]
    },
    firstPoint: [0,0]
  },


  c_kochCurve: {
    key: "kochCurve",
    name: "Koch Curve [4]",
    transforms: [
      { linear: [[1/3, 0],[0, 1/3]] },
      { linear: [[1/6, Math.sqrt(3)/6],[-Math.sqrt(3)/6, 1/6]], translation: [1/3, 0] },
      { linear: [[1/6,-Math.sqrt(3)/6],[ Math.sqrt(3)/6, 1/6]], translation: [1/2, Math.sqrt(3)/6] },
      { linear: [[1/3, 0],[0, 1/3]], translation: [ 2/3, 0]},
    ],
    weights: 'uniform',
    referenceRegion: {
      o: [0,0],
      e1: [1,0],
      e2: [0, Math.sqrt(3)/6]
    },
    firstPoint: [0, 0],
  },


  d_sierpinskiPentagon: {
    key: "sierpinskiPentagon",
    name: "Sierpinski Pentagon [5]",
    transforms: [
      { linear: [[0.382, 0],[0, 0.382]] },
      { linear: [[0.382, 0],[0, 0.382]], translation: [0.618,0]},
      { linear: [[0.382, 0],[0, 0.382]], translation: [0.809,0.588]},
      { linear: [[0.382, 0],[0, 0.382]], translation: [0.309,0.951]},
      { linear: [[0.382, 0],[0, 0.382]], translation: [-0.191,0.588]},
    ],
    weights: 'uniform',
    referenceRegion: {
      o: [-.3, 0],
      e1: [1.6,0],
      e2: [0,1.545]
    },
    firstPoint: [0, 0]
  },


  f_kochSnowflake: {
    key: "kochSnowflake",
    name: "Koch Snowflake [7]",
    transforms: [
      { linear: [[1/2, Math.sqrt(3)/6],[-Math.sqrt(3)/6, 1/2]] },
      { linear: [[1/3, 0],[0, 1/3]], translation: [ 1/Math.sqrt(3), 1/3]},
      { linear: [[1/3, 0],[0, 1/3]], translation: [ 0, 2/3]},
      { linear: [[1/3, 0],[0, 1/3]], translation: [-1/Math.sqrt(3), 1/3]},
      { linear: [[1/3, 0],[0, 1/3]], translation: [-1/Math.sqrt(3),-1/3]},
      { linear: [[1/3, 0],[0, 1/3]], translation: [ 0,-2/3]},
      { linear: [[1/3, 0],[0, 1/3]], translation: [ 1/Math.sqrt(3),-1/3]},
    ],
    weights: 'uniform',
    referenceRegion: {
      o: [-Math.sqrt(3)/2,-1],
      e1: [Math.sqrt(3),0],
      e2: [0,2]
    },
    firstPoint: [0, 0],
  },



}

// mcWortersPentigree: {
//     transforms: [
//       { linear: [[0.309, 0.255],[-0.255, 0.309]] },
//       { linear: [[-0.118, 0.363],[-0.363,-0.118]], translation: [ 0.309, 0.225]},
//       { linear: [[ 0.309,-0.225],[ 0.225, 0.309]], translation: [ 0.191, 0.588]},
//       { linear: [[-0.118,-0.363],[ 0.363,-0.118]], translation: [ 0.500, 0.363]},
//       { linear: [[ 0.309,-0.225],[ 0.225, 0.309]], translation: [ 0.382, 0.000]},
//       { linear: [[ 0.309, 0.225],[-0.225, 0.309]], translation: [ 0.691,-0.225]},
//     ],
//     weights: 'uniform',
//     referenceRegion: {
//       o: [-0.49, 0],
//       e1: [0.98,0],
//       e2: [0,0.88]
//     },
//     firstPoint: [0, 0]
//   },
