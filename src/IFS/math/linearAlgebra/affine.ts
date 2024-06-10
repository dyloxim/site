import Linear from './linear'
import Vector from './vector'
import Translation from './translation'
import Transform from './transform'


export default class Affine extends Transform {

  linear: Linear;

  translation: Translation;

  constructor(m: number[][], v: number[]) {
    super();
    this.linear = new Linear(...m);
    this.translation = new Translation(...v);
  }

  apply = (v: number[]): number[] => this.translation.apply(this.linear.apply(v));

}

