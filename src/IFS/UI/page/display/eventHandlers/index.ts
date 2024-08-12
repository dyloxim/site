import { default as setupMouseMoveHandler } from './mouseMove'
import { default as setupMouseDownHandler } from './mouseDown'
import { default as setupMouseUpHandler } from './mouseUp'
import { default as setupWheelHandler } from './wheel'

const handlers = [
  setupMouseMoveHandler,
  setupMouseDownHandler,
  setupMouseUpHandler,
  setupWheelHandler
];

export default handlers;
