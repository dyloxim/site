import Transform from './transform'
import Vector from './vector'

export default class Translation extends Transform {

  weights: number[];

  constructor(...weights: number[]) {
    super();
    this.weights = weights
  }

  apply = (v: number[]): number[] => {
    return Vector.add(this.weights, v);
  }
}
