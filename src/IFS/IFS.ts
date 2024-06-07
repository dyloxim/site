import Affine from './linearAlgebra/affine'

export default class IFS {

  transformations: Affine[];

  weightings: number[];

  order: number;

  constructor(transformations: Affine[], weightings: number[]) {
    if (transformations.length !== weightings.length) {
      throw `Number of transformations '${transformations}' does not correspond with number of weightings; '${weightings}'`;
    } else {
      this.transformations = transformations;
      let weightingSum = weightings.reduce((a, b) => a + b);
      this.weightings = weightings.map(a => a / weightingSum);
      this.order = weightings.length;
    }
  }

  static uniformWeights(...transformations: Affine[]): IFS {
    let order = transformations.length;
    let weightings = Array.from({length: order}, () => 1/order);
    return new this(transformations, weightings);
  }

  getTransform = (): Affine => {
    let probabilitySum = this.weightings[0]
    let regions = this.weightings.slice();
    for (let i = 1; i < this.order; i++) {
      probabilitySum += this.weightings[i]
      regions[i] = probabilitySum;
    }
    let dart = Math.random()
    let choice = 0
    for (let i = 0; i < this.order; i++) {
      if (regions[i] > dart) { choice = i; break; }
    }
    return this.transformations[choice];
  }

}
