import { default as setupMouseMoveHandler } from './canvasEvents/mouseMove'
import { default as setupMouseDownHandler } from './canvasEvents/mouseDown'
import { default as setupMouseUpHandler } from './canvasEvents/mouseUp'
import { default as setupMouseOutHandler } from './canvasEvents/mouseOut'

import { default as setupWheelHandlerCanvas } from './canvasEvents/wheel'

import { default as setupTouchStartHandler } from './canvasEvents/touchStart'
import { default as setupTouchEndHandler } from './canvasEvents/touchEnd'
import { default as setupTouchMoveHandler } from './canvasEvents/touchMove'

import { default as setupResizeHandler } from './windowEvents/resize'
import { default as setupKeyDownHandler } from './windowEvents/keydown'


const handlers = {

  canvasEvents: [

    setupMouseMoveHandler,
    setupMouseDownHandler,
    setupMouseUpHandler,
    setupMouseOutHandler,
    // ... ... ... ...
    setupWheelHandlerCanvas,
    // ... ... ... ...
    setupTouchStartHandler,
    setupTouchEndHandler,
    setupTouchMoveHandler,

  ], windowEvents: [

    setupResizeHandler,
    setupKeyDownHandler,

  ]
}

export default handlers;
