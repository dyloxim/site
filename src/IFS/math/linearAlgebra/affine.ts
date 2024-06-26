import Linear from './linear'
import Translation from './translation'
import Transform from './transform'
import Trans2 from './trans2';
import Lin2x2 from './lin2x2';

export default class Affine extends Transform {

  linear: Linear;

  translation: Translation;

  constructor(m: number[][], v: number[]) {
    super();
    if ( m.length == 2 && m[0].length == 2 )
      this.linear = new Lin2x2(...m);
    else
      this.linear = new Linear(...m);
    if ( v.length == 2 )
      this.translation = new Trans2(...v);
    else
      this.translation = new Translation(...v);
  }

  apply = (v: number[]): number[] => this.translation.apply(this.linear.apply(v));

}

