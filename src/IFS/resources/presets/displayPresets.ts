import { I_displayConfig } from "@IFS/types/configuration";

import * as Colors from "@IFS/resources/colors"

export const defaultDisplay: I_displayConfig = {
  domain: {
    origin: [0, 0],
    displayRadius: 0,
  },
  color: {
    base: Colors.White,
  },
  rendering: {
    devicePixelRatio: 1,
    upscaleFactor: .4,
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
