import I_FunctionSystem from '@IFS/types/I_functionSystem';
import Transform from '@IFS/math/linearAlgebra/transform';

export default class FunctionSystem {

  transforms: Transform[];

  weights: number[];

  order: number;

  constructor(def: I_FunctionSystem) {
    this.order = def.transforms.length;
    this.transforms = def.transforms;
    if (def.weights == 'uniform') {
      this.weights = Array.from({length: this.order}, ()=> 1/this.order);
    } else if (def.transforms.length !== def.weights.length) {
      throw `Number of transforms '${def.transforms}' does not correspond with number of weights; '${def.weights}'`;
    } else {
      let weightSum = def.weights.reduce((a, b) => a + b);
      this.weights = def.weights.map(a => a / weightSum);
    }
  }

}
