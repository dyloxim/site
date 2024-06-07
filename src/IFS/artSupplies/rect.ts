import Vector from '../linearAlgebra/vector';

export default class Rect {
  height: number;
  width: number;

  constructor(width: number, height: number) {
    this.height = height;
    this.width = width;
  }

  scale = (a: number): Rect => {
    let newDims = Vector.scale([this.width, this.height], a);
    return new Rect(newDims[0], newDims[1]);
  }

}
