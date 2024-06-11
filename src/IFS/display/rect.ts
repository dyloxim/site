import Vector from '@IFS/math/linearAlgebra/vector';

export default class Rect {
  width: number;
  height: number;

  constructor(...dims: number[]) {
    if (dims.length !== 2) {
      throw `Rect requires exactly two numerical arguments ('${dims}' supplied).`
    }
    this.width = dims[0];
    this.height = dims[1];
  }

  scale = (a: number): Rect => {
    let newDims = Vector.scale([this.width, this.height], a);
    return new Rect(newDims[0], newDims[1]);
  }

}
