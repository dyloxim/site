import Vec2 from "../linearAlgebra/vec2";

export default class Line {

  p: number[]
  v: number[]

  constructor([px, py]: number[], [qx, qy]: number[]) {

    this.p = [px, py];
    this.v = [qx, qy];

  }

  static intersection(l1: Line, l2: Line): number[] | null {

    let [px, py] = l1.p;
    let [vx, vy] = l1.v;
    let [qx, qy] = l2.p;
    let [wx, wy] = l2.v;

    let det = vx*wy - vy*wx

    if (det == 0) {

      return null;

    } else {

      let lambda = (wy*(qx-px) - wx*(qy-py))/det;
      return Vec2.add([px, py], Vec2.scale([vx, vy], lambda))

    }

  }

}
