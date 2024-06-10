import Vector from './vector';
import Transform from './transform'

export default class Linear extends Transform {

  dimensions: number[];

  weights: number[][];

  constructor(...weights: number[][]) {
    super();
    this.weights = weights;
    this.dimensions = [weights.length, weights[0].length];
  }

  static empty(input_dim: number, output_dim: number) {
    return new this(...Array.from({ length: input_dim }, () => {
      return Array.from({ length: output_dim }, () => 0)
    }));
  }

  static identity(n: number): Linear {
    let id_mat = this.empty(n, n);
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (i == j) { id_mat.weights[i][j] = 1 }
      }
    }
    return id_mat;
  }

  scale = (a: number): Linear => {
    return new Linear(...this.weights.map(v => v.map(e => e * a)));
  }

  apply = (v: number[]): number[] => {
    if (this.dimensions[1] == v.length) {
      let projected_basis = Array.from({ length: this.dimensions[0] }, () => {
        return Array.from({ length: this.dimensions[1] }, () => 0);
      })

      for (let i = 0; i < this.dimensions[0]; i++) {
        for (let j = 0; j < this.dimensions[1]; j++) {
          projected_basis[i][j] = this.weights[i][j] * v[i]
        }
      }

      return projected_basis.reduce((p, q) => Vector.add(p, q));

    } else {
      throw `Dimensions of '${JSON.stringify(v)}' incomensurable with '${JSON.stringify(this)}'`;
    }
  }

  mult = (m: Linear): Linear => {
    if (m.dimensions[1] == this.dimensions[0])
      return new Linear(...m.weights.map(v => this.apply(v)));
    else throw `Dimensions of M and N incompatible ('${this.dimensions}' and'${m.dimensions}')`;
  }

  transpose = (): Linear => {
    let transpose_mat = Linear.empty(this.dimensions[1], this.dimensions[0])
    for (let i = 0; i < transpose_mat.dimensions[0]; i++) {
      for (let j = 0; j < transpose_mat.dimensions[1]; j++) {
        transpose_mat.weights[i][j] = this.weights[j][i]
      }
    }
    return transpose_mat
  }

  submatrix = (i: number, j: number): Linear => {

    if (i >= 0 && i < this.dimensions[0]
      && j >= 0 && j < this.dimensions[1]) {

      // initialise empty array
      let new_weights = Array.from({ length: this.dimensions[0] - 1 }, () => {
        return Array.from({ length: this.dimensions[1] - 1 }, () => 0);
      })

      for (let m = 0; m < this.dimensions[0] - 1; m++) {
        for (let n = 0; n < this.dimensions[1] - 1; n++) {
          new_weights[m][n] = this.weights[m < i ? m : m + 1][n < j ? n : n + 1];
        }
      }

      let result = new Linear(...new_weights);

      return result;

    } else {

      throw `Indicies not in range [${i},${j}] finding minor of ${JSON.stringify(this)}`;

    }
  }

  first_minor = (i: number, j: number): number => {
    return this.submatrix(i, j).det();
  }

  cofactor = (i: number, j: number): number => {
    return Math.pow(-1, i + j) * this.first_minor(i, j);
  }

  det = (): number => {
    if (this.dimensions[0] == this.dimensions[1]) {
      if (this.dimensions[0] == 1) {
        // trivial case
        return this.weights[0][0];
      } else if (this.dimensions[0] == 2) {
        // 2x2 case
        return this.weights[0][0] * this.weights[1][1] - this.weights[0][1] * this.weights[1][0];
      } else {
        // use laplace expansion (ease of implementation) for larger square matricies
        let result = 0;
        for (let i = 0; i < this.dimensions[0]; i++) {
          result += this.cofactor(i, 0);
        }
        return result;
      }
    } else {
      throw "Cannont compute determinant on non-square matrix";
    }
  }

  adjugate = (): Linear => {
    let cofactor_mat = Linear.empty(this.dimensions[0], this.dimensions[1])
    for (let i = 0; i < this.dimensions[0]; i++) {
      for (let j = 0; j < this.dimensions[1]; j++) {
        cofactor_mat.weights[i][j] = this.cofactor(i, j)
      }
    }
    return cofactor_mat;
  }

  inverse = (): Linear => {
    return this.adjugate().transpose().scale(1 / this.det())
  }

}
