import Render from "./render";
import Painter from "./painter";
import Rig from './rig';
import Color from "./color";
import I_displayConfig from "@IFS/types/I_displayConfig";

export default class DisplayApperatus {

  config: I_displayConfig;

  render: Render;

  rig: Rig;


  constructor(config: I_displayConfig, canvas: HTMLCanvasElement) {
    this.config = config;
    this.render = new Render(this.config, canvas);
    this.rig = new Rig(this.config, this.render.getPrintArea());
  }

  reconstruct = (config: I_displayConfig): void => {
    console.log("reconstructing")
    console.log("config is:")
    console.log(config)
    this.config = config;
    this.render.reconstruct(this.config)
    this.rig.reconstruct(this.config, this.render.getPrintArea())
    console.log("render is:")
    console.log(this.render)
    console.log("rig is:")
    console.log(this.rig)
  }

  projectedPoint = (p: number[]): number[] => {
    return this.rig.project(p, this.render.printArea.width);
  }

  addPoint = (p: number[], color: Color): void => {
    let _p = this.projectedPoint(p)
    Painter.putPixel_quantize(this.render, _p, color)
  }

  addLine = (p: number[], q: number[], color: Color): void => {
    let _p = this.projectedPoint(p)
    let _q = this.projectedPoint(q)
    Painter.putLine(this.render, _p, _q, color);
  }

  update = () => {
    this.render.commitChanges();
  }

}
