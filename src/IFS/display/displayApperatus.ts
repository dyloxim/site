import { ImageComposer, Rig, PrintLayer, Painter } from "@IFS/display"
import { default as Color } from "@IFS/display/util/color";
import { default as Vec } from "@IFS/math/linearAlgebra/vec2"

import { I_displayConfig } from "@IFS/types/configuration";


export default class DisplayApperatus {

  config: I_displayConfig;

  imageComposer: ImageComposer;

  rig: Rig;


  constructor(
    config: I_displayConfig,
    displayContainer: HTMLDivElement
  ) {
    this.config = config;
    this.imageComposer = new ImageComposer(this.config, displayContainer);
    this.rig = new Rig(this.config, this.imageComposer.getPrintArea());
  }

  reconstruct = (config: I_displayConfig): void => {
    this.config = config;
    this.imageComposer.reconstructAll(this.config)
    this.rig.reconstruct(this.config, this.imageComposer.getPrintArea())
  }

  draftPoint = (print: PrintLayer, p: number[], color: Color): void => {
    let _p = this.rig.projectPoint(p)
    Painter.putPixel_quantize(print, this.imageComposer.printArea, _p, color)
  }

  draftLine = (print: PrintLayer, p: number[], q: number[], color: Color): void => {
    let [_p, _q] = this.rig.projectPoints(p, q);
    Painter.putLine(print, this.imageComposer.printArea, _p, _q, color);
  }

  draftPolygon = (print: PrintLayer, verts: number[][], vertSize: number | null, color: Color): void => {
    verts = verts.concat([verts[0]])
    verts.reduce((p, q) => { this.draftLine(print, p, q, color); return q });
    if (vertSize)
      verts.forEach(p => { this.draftCircle(print, p, vertSize, true, color) });

  }

  draftCircle = (
    print: PrintLayer,
    origin: number[],
    rad: number,
    fill: boolean,
    color: Color) => {
    let _origin = this.rig.projectPoint(origin);
    let _rad = this.rig.projectLength(rad);
    Painter.putCircle(print, this.imageComposer.printArea, _origin, _rad, fill, color)
  }

  draftCentreSquare = (
    print: PrintLayer,
    centre: number[],
    taxiRadius: number,
    vertSize: number,
    color: Color) => {
    let verts = [
      Vec.add(centre, [-taxiRadius, -taxiRadius]),
      Vec.add(centre, [-taxiRadius, +taxiRadius]),
      Vec.add(centre, [+taxiRadius, +taxiRadius]),
      Vec.add(centre, [+taxiRadius, -taxiRadius]),
    ]
    this.draftPolygon(print, verts, vertSize, color);
  }

  updateFigure = () => this.imageComposer.layers.figure.commit()
  updatePathOverlay = () => this.imageComposer.layers.pathOverlay.commit()
  updateBboxesOverlay = () => this.imageComposer.layers.bboxesOverlay.commit()
  updateAll = () => this.imageComposer.commitAll();

  clearFigure = () => this.imageComposer.layers.figure.clear()
  clearPathOverlay = () => this.imageComposer.layers.pathOverlay.clear()
  clearBboxesOverlay = () => this.imageComposer.layers.bboxesOverlay.clear()
  clearSelectionOverlay = () => this.imageComposer.layers.selectionOverlay.clear()
  clearAll = () => this.imageComposer.clearAll();

  getPrintWidth = () => { return this.imageComposer.printArea.width }

}
