import Color from "@IFS/display/color";
import Palette from "@IFS/display/palette";

export default interface I_displayConfig {
  domain: {
    origin: number[],
    displayRadius: number
  },
  color: {
    multi: boolean,
    base: Color,
    palette: Palette
  },
  rendering: {
    upscaleFactor: number,
  }
}
