import I_FunctionSystem from '@IFS/types/I_functionSystem';
import Transform from '@IFS/math/linearAlgebra/transform';

export default class FunctionSystem {

  transforms: Transform[];

  weights: number[];

  order: number;

  constructor(def: I_FunctionSystem) {
    if (def.transforms.length !== def.weights.length) {
      throw `Number of transforms '${def.transforms}' does not correspond with number of weights; '${def.weights}'`;
    } else {
      this.transforms = def.transforms;
      this.order = def.transforms.length;
      if (def.weights == 'uniform') {
        this.weights = Array.from({length: this.order}, ()=> 1/this.order);
      } else {
        let weightSum = def.weights.reduce((a, b) => a + b);
        this.weights = def.weights.map(a => a / weightSum);
      }
    }
  }

  randomTransform = (): Transform => {
    let probabilitySum = this.weights[0]
    let regions = this.weights.slice();
    for (let i = 1; i < this.order; i++) {
      probabilitySum += this.weights[i]
      regions[i] = probabilitySum;
    }
    let dart = Math.random()
    let choice = 0
    for (let i = 0; i < this.order; i++) {
      if (regions[i] > dart) { choice = i; break; }
    }
    return this.transforms[choice];
  }

}
