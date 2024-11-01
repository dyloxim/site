import { I_displayConfig } from "@IFS/types/configuration";

export const defaultDisplay: I_displayConfig = {
  domain: {
    origin: [0, 0],
    displayRadius: 0,
  },
  rendering: {
    devicePixelRatio: 1,
    upscaleFactor: .6,
  },
  overlays: {
    boundingBoxes: false,
    path: {
      showLast: false,
      persist: false,
    }
  },
  tacit: {
    isMobile: false
  }
}
