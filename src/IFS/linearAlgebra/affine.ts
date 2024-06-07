import Matrix from './matrix'
import Vector from './vector'

export default class Affine {

  matrix: Matrix;

  translation: number[];

  constructor(m: Matrix, v: number[]) {
    this.matrix = m;
    this.translation = v;
  }

  static pureLinear(m: Matrix): Affine {
    return new this(m, Vector.identity(m.dimensions[1]));
  }

  static pureTranslation(v: number[]): Affine {
    return new this(Matrix.identity(v.length), v);
  }

  apply = (v: number[]): Vector => Vector.add(this.matrix.apply(v), this.translation);

}

