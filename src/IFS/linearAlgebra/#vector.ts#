
export default class Vector {

  static identity(n: number) {
    return Array.from({ length: n }, () => 0);
  }

  static scale = (v: number[], a: number): number[] => {
    return v.map((entry) => a * entry);
  }

  static add = (...vectors: number[][]): number[] => {
    return vectors.reduce((v, w) => {
      if (v.length == w.length)
        return v.map((v_e, idx): number => v_e + w[idx]);
      else throw "Added vectors must have same dimension.";
    });
  }

  static minus = (v: number[], ...vectors: number[][]): number[] => {
    return this.add(v, ...vectors.map(w => this.scale(w,-1)));
  }

  static dot = (v: number[], w: number[]): number => {
    if (v.length == w.length) 
      return v.map((v_i, i) => v_i * w[i]).reduce((pa, qa) => pa + qa);
    else throw "Added vectors must have same dimension.";
  }

  static mod = (v: number[]): number => this.dot(v,v);

}
