import { default as Color } from "@IFS/display/util/color";
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
    this.renderer.reconstructAll(this.config)
    this.rig.reconstruct(this.config, this.renderer.getPrintArea())
  }

  draftPoint = (print: PrintLayer, p: number[], color: Color): void => {
    let _p = this.rig.projectPoint(this.renderer.printArea.width, p)
    Painter.putPixel_quantize(print, this.renderer.printArea, _p, color)
  }

  draftLine = (print: PrintLayer, p: number[], q: number[], color: Color): void => {
    let [_p, _q] = this.rig.projectPoints(this.renderer.printArea.width, p, q);
    Painter.putLine(print, this.renderer.printArea, _p, _q, color);
  }

  updateFigure = () => this.renderer.layers.figure.commit()
  updatePathOverlay = () => this.renderer.layers.pathOverlay.commit()
  updateBboxesOverlay = () => this.renderer.layers.bboxesOverlay.commit()
  updateAll = () => this.renderer.commitAll();

  clearFigure = () => this.renderer.layers.figure.clear()
  clearPathOverlay = () => this.renderer.layers.pathOverlay.clear()
  clearBboxesOverlay = () => this.renderer.layers.bboxesOverlay.clear()
  clearAll = () => this.renderer.clearAll();

}
