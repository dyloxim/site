import { default as Rect } from "@IFS/display/util/rect";
import { default as PrintLayer } from "@IFS/display/printLayer";
import { DisplayLayer } from "@IFS/types/specifications";
import { DefinedDisplayLayers } from "@IFS/resources/globalConstants";

import { I_displayConfig } from "@IFS/types/configuration"

export default class ImageComposer {

  layers: Record<DisplayLayer, PrintLayer>;
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
    this.borderRect = new Rect(
      Number(displayContainer.style.width.replace(/([0-9]+)px/, '$1')),
      Number(displayContainer.style.height.replace(/([0-9]+)px/, '$1'))
    )

    this.printArea = this.borderRect.scale(config.rendering.upscaleFactor)
      .nearestWholeNumberDimensions();

    let newLayers: Record<string, PrintLayer> = {};
    DefinedDisplayLayers.forEach((name, i) => {

      let canvas = this.getConfiguredCanvas(displayContainer, name + "Canvas", i+1)
      displayContainer.appendChild(canvas);
      newLayers[name] = new PrintLayer(name, canvas, this.printArea);

    })

    this.layers = newLayers;
    this.commitAll()
  }

  getConfiguredCanvas = (displayContainer: HTMLDivElement, name: string, zIndex: number) => {
    let canvas = document.createElement('canvas');
    canvas.id = name;
    canvas.style.imageRendering = "pixelated";
    canvas.style.position = "absolute";
    canvas.style.left = "0";
    canvas.style.top = "0";
    canvas.style.width = displayContainer.style.width;
    canvas.style.height = displayContainer.style.height;
    canvas.style.zIndex = `${zIndex}`;
    return canvas;
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
