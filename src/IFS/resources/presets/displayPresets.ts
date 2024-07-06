import { I_displayConfig } from "@IFS/types/configuration";

import * as Colors from "@IFS/resources/colors"
import * as Palettes from "@IFS/resources/palettes"

export const defaultDisplay: I_displayConfig = {
  domain: {
    origin: [0, 0],
    displayRadius: 0,
  },
  color: {
    multi: false,
    base: Colors.White,
    palette: Palettes.Primary,
  },
  rendering: {
    upscaleFactor: 1.3,
  },
  animation: {
    rate: 1,
  },
  overlays: {
    boundingBoxes: false,
    path: {
      showLast: true,
      persist: false,
    }
  }
}
