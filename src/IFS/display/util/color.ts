
export default class Color {
  r: number;
  g: number;
  b: number;
  a: number;

  constructor(r: number, g: number, b: number, a: number) {
    [this.r, this.g, this.b, this.a] = [r, g, b, a];
  }

  static multiply = (base: Color, arg: number): Color => {
    return new Color(
      Math.max(0, Math.min(255, 255 * ((base.r / 255) * arg))),
      Math.max(0, Math.min(255, 255 * ((base.g / 255) * arg))),
      Math.max(0, Math.min(255, 255 * ((base.b / 255) * arg))),
      Math.max(0, Math.min(255, 255 * ((base.a / 255) * (Math.pow(arg, 1/3))))),
    )
  }

  static multiplySolid = (base: Color, arg: number): Color => {
    return new Color(
      Math.max(0, Math.min(255, 255 * ((base.r / 255) * arg))),
      Math.max(0, Math.min(255, 255 * ((base.g / 255) * arg))),
      Math.max(0, Math.min(255, 255 * ((base.b / 255) * arg))),
      base.a
    )
  }

  toRGBAString = (): string => {
    return `rgba(${this.r},${this.g},${this.b},${this.a})`;
  }
}
