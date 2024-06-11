import Color from "@IFS/display/color";
import Palette from "@IFS/display/palette";

export default interface I_DisplayParams {
  displayRegion: {
    origin: number[],
    displayRadius: number
  },
  baseColor: Color,
  palette: Palette,
  useColor: boolean,
  pixPerUnit: number,
}
