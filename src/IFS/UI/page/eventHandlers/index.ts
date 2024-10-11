import { default as setupMouseMoveHandler } from './mouseMove'
import { default as setupMouseDownHandler } from './mouseDown'
import { default as setupMouseUpHandler } from './mouseUp'
import { default as setupMouseOutHandler } from './mouseOut'
import { default as setupWheelHandler } from './wheel'

import { default as setupTouchStartHandler } from './touchStart'
import { default as setupTouchEndHandler } from './touchEnd'
import { default as setupTouchMoveHandler } from './touchMove'


const handlers = [
  setupMouseMoveHandler,
  setupMouseDownHandler,
  setupMouseUpHandler,
  setupMouseOutHandler,
  setupWheelHandler,
  setupTouchStartHandler,
  setupTouchEndHandler,
  setupTouchMoveHandler
];

export default handlers;
