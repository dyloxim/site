import Color from "@IFS/display/color";

export default interface I_DisplayParams {
  displayRegion: {
    origin: number[],
    displayRadius: number
  },
  baseColor: Color;
}
