
export default class Color {
  r: number;
  g: number;
  b: number;
  a: number;

  constructor(r: number, g: number, b: number, a: number) {
    [this.r, this.g, this.b, this.a] = [r, g, b, a];
  }
}
