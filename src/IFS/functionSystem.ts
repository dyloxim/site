import { I_functionSystem } from '@IFS/types/configuration';
import { default as Transform } from '@IFS/math/linearAlgebra/transform';
import { default as TransformFactory } from '@IFS/math/linearAlgebra/transformFactory';
import { I_affine } from './types/mathematical';

export default class FunctionSystem {

  transforms: Transform[];

  weights: number[];

  controlPoints: {
    origin: number[],
    basis: number[][]
  }[];

  constructor(def: I_functionSystem) {
    this.transforms = def.transforms.map((t) => TransformFactory.getInstance(t));
    if (def.weights == 'uniform') {
      this.weights = Array.from({length: this.order()}, ()=> 1/this.order());
    } else if (def.transforms.length !== def.weights.length) {
      throw `Number of transforms '${def.transforms}' does not correspond with number of weights; '${def.weights}'`;
    } else {
      let weightSum = def.weights.reduce((a, b) => a + b);
      this.weights = def.weights.map(a => a / weightSum);
    }
    this.controlPoints = def.transforms.map(T => {
      return {
        origin: (T as I_affine).translation ?? [0,0],
        basis: (T as I_affine).linear
      }

    });
  }

  order = (): number => this.transforms.length;

}
