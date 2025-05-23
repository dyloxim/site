import { I_transform } from "@IFS/types/mathematical";
import Color from "@IFS/display/util/color";
import Palette from "@IFS/display/util/palette";

export interface I_functionSystem {
  name: string,
  key: string,
  transforms: I_transform[],
  weights: number[] | 'uniform',
  referenceRegion: {
    o: number[],
    e1: number[],
    e2: number[]
  },
  firstPoint: number[],
  colors: {
    palette: Palette,
    base: Color,
    bg: Color
  }
}

export interface I_displayConfig {
  domain: {
    origin: number[],
    displayRadius: number
  },
  rendering: {
    upscaleFactor: number,
    devicePixelRatio: number
  },
  overlays: {
    boundingBoxes: boolean,
    path: {
      showLast: boolean,
      persist: boolean,
    }
  },
  tacit: {
    isMobile: boolean
  }
}

export interface I_settings {
  FS: I_functionSystem,
  display: I_displayConfig,
}
