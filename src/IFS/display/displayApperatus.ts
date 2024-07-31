import { ImageComposer, Rig, PrintLayer, Painter } from "@IFS/display"
import { default as Color } from "@IFS/display/util/color";
import { default as Vec } from "@IFS/math/linearAlgebra/vec2"

import { I_displayConfig } from "@IFS/types/configuration";
import * as Colors from "@IFS/resources/colors"
import Util from "@IFS/execution/util";
import { SelectableEntityCategory } from "@IFS/types/interaction";


export default class DisplayApperatus {

  // Properties
  // ----------

  config: I_displayConfig;
  imageComposer: ImageComposer;
  rig: Rig;


  // Initialization
  // --------------

  constructor(
    config: I_displayConfig,
    displayContainer: HTMLDivElement
  ) {

    this.config = config;

    this.imageComposer = new ImageComposer(this.config, displayContainer);

    this.rig = new Rig(this.config, this.imageComposer.getPrintArea());

  }


  // Reconfiguration
  // ---------------

  reconstruct = (config: I_displayConfig): void => {
    this.config = config;
    this.imageComposer.reconstructAll(this.config)
    this.rig.reconstruct(this.config, this.imageComposer.getPrintArea())
  }


  
  // Drawing procedures
  // ------------------

  draftPoint = (print: PrintLayer, p: number[], color: Color): void => {
    let _p = this.rig.projectPoint(p)
    Painter.putPixel_quantize(print, this.imageComposer.printArea, _p, color)
  }


  draftLine = (print: PrintLayer, p: number[], q: number[], color: Color): void => {
    let [_p, _q] = this.rig.projectPoints(p, q);
    Painter.putLine(print, this.imageComposer.printArea, _p, _q, color);
  }


  draftPolygon = (
    print: PrintLayer,
    verts: number[][],
    vertSize: number | null,
    color: Color
  ): void => {

    verts = verts.concat([verts[0]])

    verts.reduce((p, q) => {
      this.draftLine(print, p, q, color);
      return q
    });

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


  draftSolidParallelogram = (
    print: PrintLayer,
    p: number[],
    q: number[],
    r: number[],
    color: Color
  ) => {
    let [_p, _q, _r] = [p, q, r].map(v => this.rig.projectPoint(v));
    Painter.putSolidParallelogram(print, this.imageComposer.printArea, _p, _q, _r, color)
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




  // Drawing semantic components
  // ---------------------------

  draftHoverCue = (p: number[], mainColor: Color, targetType: SelectableEntityCategory) => {

    let layer = this.imageComposer.layers.hoverOverlay;
    let surroundColor = Color.multiply(this.config.color.base, .6);
    let vertSize = Util.getVertRadius(this.config);

    switch (targetType) {

      case "primaryControlPoints":
        this.draftCircle(layer, p, vertSize * 2, true, surroundColor)
        this.draftCircle(layer, p, vertSize, true, mainColor)
        break;

      case "secondaryControlPoints":
        this.draftCircle(layer, p, vertSize * 1.7, true, surroundColor)
        this.draftCircle(layer, p, vertSize * .7, true, mainColor)
        break;

    }

  }

  draftPrimaryControlPoint = (p: number[], color: Color, highlight: boolean) => {

    let layer = (_ => {
      if (highlight) return this.imageComposer.layers.selectionOverlay;
      else return this.imageComposer.layers.controlPointsOverlay;
    })()

    let surroundColor = Color.multiply(this.config.color.base, highlight? .5 : .2);
    let vertSize = Util.getVertRadius(this.config);

    this.draftCircle(layer, p, vertSize * 2, true, surroundColor)
    this.draftCircle(layer, p, vertSize, true, color)

  }


  draftSecondaryControlPoint = (p: number[], color: Color) => {

    let layer = this.imageComposer.layers.selectionOverlay;

    let surroundColor = Color.multiply(this.config.color.base, .2);
    let vertSize = Util.getVertRadius(this.config);

    this.draftCircle(layer, p, vertSize * 1.7, true, surroundColor)
    this.draftCircle(layer, p, vertSize * .7, true, color)

  }


  draftSelectionOverlay = (K: { origin: number[], basis: number[][] }, color: Color) => {

    let layer = this.imageComposer.layers.selectionOverlay
    let bgFillColor = Color.multiply(this.config.color.base, .12);

    let corners = [
      K.origin,
      Vec.add(K.origin, K.basis[0]),
      Vec.add(K.origin, K.basis[1]),
      Vec.sum(K.origin, K.basis[0], K.basis[1])
    ]

    this.draftSolidParallelogram(layer, corners[0], corners[1], corners[2], bgFillColor);

    [corners[1], corners[2]].forEach((p, i) => {
        let color = i == 0 ? Colors.Red : Colors.Green;
        this.draftLine(layer, corners[0], p, color);
        this.draftLine(layer, p, corners[3], color);
        this.draftSecondaryControlPoint(p, color);
      });

    this.draftPrimaryControlPoint(corners[0], color, true);
    this.draftSecondaryControlPoint(corners[3], Colors.Black);
    
  }




  // Standard layer operations
  // -------------------------

  updateFigure = () => this.imageComposer.layers.figure.commit()
  updatePathOverlay = () => this.imageComposer.layers.pathOverlay.commit()
  updateControlPointsOverlay = () => this.imageComposer.layers.controlPointsOverlay.commit()
  updateSelectionOverlay = () => this.imageComposer.layers.selectionOverlay.commit()

  clearGrid = () => this.imageComposer.layers.grid.clear()
  clearFigure = () => this.imageComposer.layers.figure.clear()
  clearPathOverlay = () => this.imageComposer.layers.pathOverlay.clear()
  clearControlPointsOverlay = () => this.imageComposer.layers.controlPointsOverlay.clear()
  clearSelectionOverlay = () => this.imageComposer.layers.selectionOverlay.clear()
  clearAll = () => this.imageComposer.clearAll();

  // Helper function
  // ---------------

  getPrintWidth = () => { return this.imageComposer.printArea.width }

}
