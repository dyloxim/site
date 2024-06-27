import { default as Rect } from "@IFS/display/util/rect";
import { default as PrintLayer } from "@IFS/display/printLayer";

import { I_displayConfig } from "@IFS/types/configTypes"


export default class Renderer {

  layers: {
    figure: PrintLayer,
    pathOverlay: PrintLayer,
    bboxesOverlay: PrintLayer,
  }

  borderRect: Rect;
  printArea: Rect;

  getPrintArea = () => this.printArea

  constructor(
    config: I_displayConfig,
    displayContainer: HTMLDivElement
  ) {

    // remove any canvases remaining from previous generations
    displayContainer.innerHTML = '';

    // initialize canvases
    let canvases = ["figureCanvas", "pathOverlayCanvas", "bboxOverlayCanvas"]
      .map((name, idx) => {
        let canvas = document.createElement('canvas');
        canvas.id = name;
        canvas.style.imageRendering = "pixelated";
        canvas.style.position = "absolute";
        canvas.style.left = "0";
        canvas.style.top = "0";
        canvas.style.width = displayContainer.style.width;
        canvas.style.height = displayContainer.style.height;
        canvas.style.zIndex = `${idx + 1}`;
        displayContainer.appendChild(canvas);
        return canvas;
      })

    this.borderRect = new Rect(
      Number(displayContainer.style.width.replace(/([0-9]+)px/, '$1')),
      Number(displayContainer.style.height.replace(/([0-9]+)px/, '$1'))
    )
    this.printArea = this.borderRect.scale(config.rendering.upscaleFactor)
      .nearestWholeNumberDimensions();

    this.layers = {
      figure: new PrintLayer("figure", canvases[0], this.printArea),
      pathOverlay: new PrintLayer("pathOverlay", canvases[1], this.printArea),
      bboxesOverlay: new PrintLayer("bboxesOverlay", canvases[2], this.printArea),
    }

    this.commitAll()
  }

  applyToAllLayers = (f: (layer: PrintLayer) => void): void => {
    (Object.keys(this.layers) as Array<keyof typeof this.layers>).map(key => {
      f(this.layers[key]);
    });
  }

  reconstructAll = (config: I_displayConfig): void => {
    this.printArea = this.borderRect.scale(config.rendering.upscaleFactor)
      .nearestWholeNumberDimensions();
    this.applyToAllLayers((layer: PrintLayer) => layer.reconstruct(this.printArea));
  }

  clearAll = (): void => {
    this.applyToAllLayers((layer: PrintLayer) => layer.clear());
  }

  commitAll = (): void => {
    this.applyToAllLayers((layer: PrintLayer) => layer.commit());
  }

}
