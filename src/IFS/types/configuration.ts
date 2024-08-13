import { I_transform } from "@IFS/types/mathematical";
import Color from "@IFS/display/util/color";
import Palette from "@IFS/display/util/palette";

export interface I_functionSystem {
  name: string,
  transforms: I_transform[],
  weights: number[] | 'uniform',
  referenceRegion: {
    o: number[],
    e1: number[],
    e2: number[]
  },
  firstPoint: number[]
}

export interface I_displayConfig {
  domain: {
    origin: number[],
    displayRadius: number
  },
  color: {
    base: Color,
    palette: Palette
  },
  rendering: {
    upscaleFactor: number,
    devicePixelRatio: number
  },
  animation: {
    rate: number,
  },
  overlays: {
    boundingBoxes: boolean,
    path: {
      showLast: boolean,
      persist: boolean,
    }
  }
}

export interface I_settings {
  FS: I_functionSystem,
  display: I_displayConfig,
}
