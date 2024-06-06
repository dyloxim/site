
export default class Vector {

  weights: number[];

  dimension: number;

  constructor(...weights: number[]) {
    this.weights = weights;
    this.dimension = weights.length;
  }

  static identity(n: number) {
    return new this(...Array.from({length: n}, () => 0));
  }

  scale = (a: number): Vector => new Vector(...this.weights.map((entry) => a * entry));

  add = (...vectors: Vector[]): Vector  => {
    return vectors.reduce((v, w): Vector  => {
      if (v.dimension == w.dimension) {
        return new Vector(...v.weights.map((v_e, idx): number => v_e + w.weights[idx] ));
      } else {
        throw "Added vectors must have same dimension.";
      }
    }, this);
  }

  subtract = (...vectors: Vector[]): Vector => this.add(...vectors.map(w => w.scale(-1)));

  dot = (w: Vector): number => {
    if (this.dimension == w.dimension) {
      return this.weights.map((v_e, idx) => v_e * w.weights[idx])
        .reduce((p, q) => p + q);
    } else {
      throw "Added vectors must have same dimension.";
    }
  }

  mod = (): number => this.dot(this);

}
