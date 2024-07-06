import { I_functionSystem } from '@IFS/types/configuration';
import { default as Transform } from '@IFS/math/linearAlgebra/transform';
import { default as TransformFactory } from '@IFS/math/linearAlgebra/transformFactory';
import { default as Vec } from '@IFS/math/linearAlgebra/vec2'

export default class FunctionSystem {

  transforms: Transform[];

  weights: number[];

  bboxes: {
    reference: number[][],
    transformed: number[][][],
  }

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
    let referenceBbox = [
      def.referenceRegion.o,
      Vec.add(def.referenceRegion.o, def.referenceRegion.e1),
      Vec.sum(def.referenceRegion.o, def.referenceRegion.e1, def.referenceRegion.e2),
      Vec.add(def.referenceRegion.o, def.referenceRegion.e2),
    ]
    let transformedBboxes = this.transforms.map((t) => {
      return referenceBbox.map(v => t.apply(v));
    })
    this.bboxes = {
      reference: referenceBbox,
      transformed: transformedBboxes
    }
  }

  order = (): number => this.transforms.length;

}
