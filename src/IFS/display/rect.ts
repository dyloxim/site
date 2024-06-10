import Vector from '@IFS/math/linearAlgebra/vector';

export default class Rect {
  width: number;
  height: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  scale = (a: number): Rect => {
    let newDims = Vector.scale([this.width, this.height], a);
    return new Rect(newDims[0], newDims[1]);
  }

}
