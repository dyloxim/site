import Linear from './linear'
import Translation from './translation'
import Transform from './transform'

export default class Affine extends Transform {

  linear: Linear;

  translation: Translation;

  constructor(lin: Linear, trans: Translation) {
    super();
    this.linear = lin;
    this.translation = trans;
  }

  apply = (v: number[]): number[] => this.translation.apply(this.linear.apply(v));

}

