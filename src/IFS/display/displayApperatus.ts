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
    this.rig.reload(this.config, this.imageComposer.getPrintArea())
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
    fill: boolean,
    color: Color) => {

      taxiRadius = this.rig.roundToNearestWholePixelLength(taxiRadius)

      let [p,q,r,s] = [
        Vec.add(centre, [-taxiRadius, -taxiRadius]),
        Vec.add(centre, [-taxiRadius, +taxiRadius]),
        Vec.add(centre, [+taxiRadius, +taxiRadius]),
        Vec.add(centre, [+taxiRadius, -taxiRadius]),
      ]

      if (fill) this.draftSolidParallelogram(print, p, q, s, color);
      else this.draftPolygon(print, [p,q,r,s], null, color);
     
    }




  // Drawing semantic components
  // ---------------------------

  draftHoverCue = (p: number[], mainColor: Color, targetType: SelectableEntityCategory) => {

    let layer = this.imageComposer.layers.hoverOverlay;
    let outer = new Color(210, 210, 210, 150);
    let inner =  Color.multiplySolid(mainColor, .15);
    let vertSize = this.rig.roundToNearestWholePixelLength(
      (targetType == "primaryControlPoints")
        ? Util.getVertRadius(this.config)
        : .7 * Util.getVertRadius(this.config)
    );

    let border1 = this.rig.roundToNearestWholePixelLength(
        Math.max(
          vertSize * 1.1,
          vertSize + 2 * (1/this.rig.pixPerUnit),
        )
      );

    this.draftCentreSquare(layer, p, border1, true, outer)
    this.draftCentreSquare(layer, p, vertSize, true, inner)

  }


  draftPrimaryControlPoint = (layer: PrintLayer, p: number[], active: boolean, color: Color) => {

    let grey = new Color(100, 100, 100, 180);

    let vertSize = Util.getVertRadius(this.config);
    vertSize = this.rig.roundToNearestWholePixelLength(vertSize);

    let border1 = this.rig.roundToNearestWholePixelLength(
      Math.max(
        vertSize * 1.1,
        vertSize + 2 * (1/this.rig.pixPerUnit)
      )
    )

    this.draftCentreSquare(layer, p, border1, true, grey)
    this.draftCentreSquare(layer, p, vertSize, true, color)
  }

  draftSelectionOverlay = (K: { origin: number[], basis: number[][] }, color: Color) => {

    let selectionLayer = this.imageComposer.layers.selectionOverlay;
    let bgFillColor = new Color(76, 76, 76, 80);
    let farCornerColor = new Color(56, 56, 56, 120);

    let corners = [
      K.origin,
      Vec.add(K.origin, K.basis[0]),
      Vec.add(K.origin, K.basis[1]),
      Vec.sum(K.origin, K.basis[0], K.basis[1])
    ]

    // the translucent parolellogram
    this.draftSolidParallelogram(selectionLayer, corners[0], corners[1], corners[2], bgFillColor);

    let vertSize = Util.getVertRadius(this.config);
    let smallVertSize = this.rig.roundToNearestWholePixelLength(vertSize * .7)
    let smallVertBorder = this.rig.roundToNearestWholePixelLength(Math.max(
      smallVertSize * 1.1,
      smallVertSize + 2 * (1/this.rig.pixPerUnit)
    ));
    vertSize = this.rig.roundToNearestWholePixelLength(vertSize);
    let border1 = this.rig.roundToNearestWholePixelLength(
      Math.max(
        vertSize * 1.1,
        vertSize + 2 * (1/this.rig.pixPerUnit)
      )
    );

    [corners[1], corners[2]].forEach((p, i) => {
      this.draftCentreSquare(selectionLayer, p, smallVertBorder, true, bgFillColor)
    });
    
    [corners[1], corners[2]].forEach((p, i) => {
      let color = i == 0 ? Colors.Red : Colors.Green;
      this.draftLine(selectionLayer, corners[0], p, color);
      this.draftLine(selectionLayer, corners[3], p, farCornerColor);
      this.draftCentreSquare(selectionLayer, p, smallVertSize, true, color)
    });

    this.draftCentreSquare(selectionLayer, corners[3], border1, true, bgFillColor)
    this.draftCentreSquare(selectionLayer, corners[3], vertSize, true, farCornerColor)


    this.draftCentreSquare(selectionLayer, corners[0], border1, true, bgFillColor)
    this.draftCentreSquare(selectionLayer, corners[0], vertSize, true, color)
    
  }




  // Standard layer operations
  // -------------------------

  updateFigure = () => this.imageComposer.layers.figure.commit()
  updatePathOverlay = () => this.imageComposer.layers.pathOverlay.commit()
  updateControlPointsOverlay = () => {
    this.imageComposer.layers.controlPointsOverlay.commit()
  }
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
