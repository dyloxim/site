import Vector from "./vector";

export default class Vec2 extends Vector {

  static scale(v: number[], a: number): number[] {
    return [a*v[0], a*v[1]];
  }

  static add (v: number[], w: number[]): number[] {
    return [v[0]+w[0], v[1]+w[1]];
  }

  static minus(v: number[], w: number[]) {
    return this.add(v, this.scale(w, -1));
  }

  static sum (...vectors: number[][]): number[] {
    return vectors.reduce((v, w) => [v[0]+w[0], v[1]+w[1]]);
  }

  static mod(v: number[]): number {
    return Math.sqrt(v[0]*v[0] + v[1]*v[1]);
  }

  static dist(v: number[], w: number[]) {
    return Vec2.mod(Vec2.minus(v, w));
  }

  static normalise(v: number[]) {
    return this.scale(v, 1/this.mod(v));
  }

  static dot(v: number[], w: number[]) {
    return v[0] * w[0] + v[1] * w[1];
  }

}
