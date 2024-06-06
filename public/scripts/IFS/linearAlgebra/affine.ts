import Matrix from './matrix'
import Vector from './vector'

export default class Affine {

  matrix: Matrix;

  translation: Vector;

  constructor(m: Matrix, v: Vector) {
    this.matrix = m;
    this.translation = v;
  }

  static pureLinear(m: Matrix): Affine {
    return new this(m, Vector.identity(m.dimensions[1]));
  }

  static pureTranslation(v: Vector): Affine {
    return new this(Matrix.identity(v.dimension), v);
  }

  apply = (v: Vector): Vector => {
    return this.matrix.apply(v).add(this.translation);
  }

}

Affine.pureTranslation(new Vector(1,1)).matrix
