import Vec2 from '@IFS/math/linearAlgebra/vec2';

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

  scale = (a: number): Rect => new Rect(...Vec2.scale([this.width, this.height], a));

  dims = () => [this.width, this.height]

  nearestWholeNumberDimensions = (): Rect => {
    return new Rect(Math.round(this.width), Math.round(this.height))
  }

}
