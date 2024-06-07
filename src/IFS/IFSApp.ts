import Painter from './painter';
import IFS from './IFS';

export default class IFSApp {

  painter: Painter;

  ifs: IFS;

  canvas: HTMLCanvasElement;

  renderContext: CanvasRenderingContext2D;

  displayParams: IDisplayParams;

  constructor(painter: Painter, ifs: IFS,
    canvas: HTMLCanvasElement, displayParams: IDisplayParams) {
    this.canvas = canvas;
    this.renderContext = this.canvas.getContext('2d')!;
    this.painter = painter;
    this.ifs = ifs;
    this.displayParams = displayParams;
  }

  update = (): void => {

  }

}

interface IDisplayParams {
  showAxis: boolean;
  showGrid: number;
  showTransforms: TransformStyle;

}

type TransformStyle = null | 'box' | 'basis'
