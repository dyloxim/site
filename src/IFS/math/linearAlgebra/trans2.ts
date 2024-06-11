import Translation from './translation'

export default class Trans2 extends Translation {

  x: number;
  y: number;

  constructor(...weights: number[]) {
    super(...weights);
    if (weights.length !== 2) {
      throw `2x2 matrix must have two rows and two columns. ('${weights}' provided)`
    } else {
      this.x = weights[0];
      this.y = weights[1];
    }
  }

  apply = (v: number[]): number[] => {
    return [v[0] + this.x, v[1] + this.y];
  }
}
