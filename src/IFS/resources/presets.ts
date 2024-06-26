import I_settings from "@IFS/types/I_settings"
import * as Colors from "@IFS/resources/colors"
import * as Palettes from "@IFS/resources/palettes"

export const barnsleyFern: I_settings = {
    program: {
        firstPoint: [0, 0],
        FS: {
            transforms: [
                { linear: [[0, 0], [0, 0.16]] },
                { linear: [[0.85, -0.04], [0.04, 0.85]], translation: [0, 1.6] },
                { linear: [[0.2, 0.23], [-0.26, 0.22]], translation: [0, 1.6] },
                { linear: [[-0.15, 0.26], [0.28, 0.24]], translation: [0, 0.44] }
            ],
            weights: [0.01, 0.85, 0.07, 0.07]
        }
    },
    display: {
        domain: {
            origin: [0, 5],
            displayRadius: 5,
        },
        color: {
            multi: false,
            base: Colors.White,
            palette: Palettes.Primary,
        },
        rendering: {
            upscaleFactor: 1.7,
        }
    },
    animation: {
        rate: 1
    },
};

export const koch: I_settings = {
  program: {
    firstPoint: [0, 0],
    FS: {
      transforms: [
        { linear: [[1/3, 0],[0,1/3]] },
        { linear: [[1/2, 0.866025],[-0.866025,1/2]] },
        { translation: [1/Math.sqrt(2), 2] },
      ],
      weights: 'uniform'
    },
  },
  display: {
    domain: {
      origin: [0, 0],
      displayRadius: 4
    },
    color: {
      multi: false,
      base: Colors.White,
      palette: Palettes.Primary,
    },
    rendering: {
      upscaleFactor: 1
    }
  },
  animation: {
    rate: 1000
  },
}

export const binaryTree: I_settings = {
  program: {
    firstPoint: [0, 0],
    FS: {
      transforms: [
        { linear: [[0.42, 0.42],[-0.42, 0.42]], translation: [-3,1.4]},
        { linear: [[-.54, -.54],[ 0.24, -.24]], translation: [2,-1.4]},
        { linear: [[0.42,-0.42],[ 0.42, 0.42]], translation: [3,1.4]},
        { linear: [[-0.54, 0.54],[-0.24,-0.24]], translation: [-2,-1.4]},
      ],
      weights: 'uniform'
    },
  },
  display: {
    domain: {
      origin: [0, 0],
      displayRadius: 4
    },
    color: {
      multi: false,
      base: Colors.White,
      palette: Palettes.Primary,
    },
    rendering: {
      upscaleFactor: 1
    }
  },
  animation: {
    rate: 1000
  },
}
