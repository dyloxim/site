import Linear from "./linear";

export default class Lin2x2 extends Linear {

  e1: number[];
  e2: number[];

  constructor(...weights: number[][]) {
    super(...weights);
    if (weights.length !== 2 && weights[0].length !== 2) {
      throw `2x2 matrix must have two rows and two columns. ('${weights}' provided)`
    } else {
    this.e1 = weights[0]
    this.e2 = weights[1]
    }
  }

  apply = (v: number[]): number[] => {
    return [
      v[0]*this.e1[0] + v[1]*this.e2[0],
      v[0]*this.e1[1] + v[1]*this.e2[1],
    ];
  }

  static identity(): Lin2x2 {
    return new Lin2x2([1,0], [0, 1]);
  }
}
