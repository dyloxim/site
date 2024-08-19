import { default as setupMouseMoveHandler } from './mouseMove'
import { default as setupMouseDownHandler } from './mouseDown'
import { default as setupWheelHandler } from './wheel'

import { default as setupTouchStartHandler } from './touchStart'
import { default as setupTouchEndHandler } from './touchEnd'
import { default as setupTouchMoveHandler } from './touchMove'


const handlers = [
  setupMouseMoveHandler,
  setupMouseDownHandler,
  setupWheelHandler,
  setupTouchStartHandler,
  setupTouchEndHandler,
  setupTouchMoveHandler
];

export default handlers;
