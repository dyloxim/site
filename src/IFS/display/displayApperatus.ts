import { default as Color } from "@IFS/display/util/color";
import { default as Rect } from "@IFS/display/util/rect";
import { Renderer, Painter, Rig, PrintLayer } from "@IFS/display"

import { I_displayConfig } from "@IFS/types/configTypes";


export default class DisplayApperatus {

  config: I_displayConfig;

  renderer: Renderer;

  rig: Rig;


  constructor(
    config: I_displayConfig,
    displayContainer: HTMLDivElement
  ) {
    this.config = config;
    this.renderer = new Renderer(this.config, displayContainer);
    this.rig = new Rig(this.config, this.renderer.getPrintArea());
  }

  reconstruct = (config: I_displayConfig): void => {
    this.config = config;
    this.renderer.reconstruct(this.config)
    this.rig.reconstruct(this.config, this.renderer.getPrintArea())
  }

  projectedPoint = (p: number[], printArea: Rect): number[] => {
    return this.rig.project(p, printArea.width);
  }

  addPoint = (print: PrintLayer, p: number[], color: Color): void => {
    let _p = this.projectedPoint(p, this.renderer.printArea)
    Painter.putPixel_quantize(print, this.renderer.printArea, _p, color)
  }

  addLine = (print: PrintLayer, p: number[], q: number[], color: Color): void => {
    let _p = this.projectedPoint(p, this.renderer.printArea)
    let _q = this.projectedPoint(q, this.renderer.printArea)
    Painter.putLine(print, this.renderer.printArea, _p, _q, color);
  }

  update = () => {
    this.renderer.show();
  }

}
