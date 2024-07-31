import FSMutator from "@IFS/execution/FSMutator";
import IFSAppWorker from "@IFS/execution/IFSAppWorker";
import MouseProcessor from "@IFS/execution/mouseProcessor";
import { DisplayLayer } from "@IFS/types/specifications";
import { SimpleTicket, BasicLayerTicket } from "@IFS/types/tickets"

/*
 * convenience function for generating tickets requesting basic layer changes
 */


export const layerUpdate = (
  instruction: "erase" | "draw",
  layers: DisplayLayer[],
): BasicLayerTicket => {
  return {
    consumer: layers,
    instructionGroup: `${(new Map([
      ["erase", "layerErase"],
      ["draw", "layerDraw"]
    ]).get(instruction) as "layerErase" | "layerDraw")}`,
    instruction: `${instruction} layers: ${layers}`,
    processor: IFSAppWorker.processLayerTicket,
    log: false
  }
};



/*
 * List of specially predefined tickets
 */

let ticketArray: SimpleTicket[] = [];

export const reloadRig: SimpleTicket = {

  instructionGroup: "rig",
  instruction: "Load rig from settings",
  processor: IFSAppWorker.loadRigFromSettings,
  log: false

}; ticketArray = [...ticketArray, reloadRig];


export const reloadFS: SimpleTicket = {

  instructionGroup: "FS",
  instruction: "Load FS from settings",
  processor: IFSAppWorker.loadFSFromSettings,
  log: false

}; ticketArray = [...ticketArray, reloadFS];


export const reloadControlPoints: SimpleTicket = {

  instructionGroup: "layerDraw",
  instruction: "Load FS handle overlays from settings",
  processor: IFSAppWorker.loadControlPointsFromSettings,
  log: false

}; ticketArray = [...ticketArray, reloadControlPoints];



export const reviewControlPointsConfig: SimpleTicket = {

  instructionGroup: "layerErase",
  instruction: "Consult settings and dispatch required tickets for control points overlay",
  processor: IFSAppWorker.reviewControlPointsConfig,
  log: true

}; ticketArray = [...ticketArray, reviewControlPointsConfig];



export const handleMouseMoveEvent: SimpleTicket = {

  instructionGroup: "mouse",
  instruction: "Handle mouse move event",
  processor: MouseProcessor.handleMoveEvent,
  log: false

}; ticketArray = [...ticketArray, handleMouseMoveEvent];



export const handleMousePressEvent: SimpleTicket = {

  instructionGroup: "mouse",
  instruction: "Handle mouse press event",
  processor: MouseProcessor.handlePressEvent,
  log: false

}; ticketArray = [...ticketArray, handleMousePressEvent];



export const showHoverTarget: SimpleTicket = {

  instructionGroup: "layerDraw",
  instruction: "show hover target",
  processor: MouseProcessor.showHoverTarget,
  log: false
  
}; ticketArray = [...ticketArray, showHoverTarget];



export const revertRigToInitial: SimpleTicket = {

  instructionGroup: "rig",
  instruction: "revert rig to initial",
  processor: IFSAppWorker.revertRigToInitial,
  log: false

}; ticketArray = [...ticketArray, revertRigToInitial];



export const normaliseControlPoints: SimpleTicket = {

  instructionGroup: "FS",
  instruction: "Normalise Control Points",
  processor: IFSAppWorker.normaliseControlPoints,
  log: false

}; ticketArray = [...ticketArray, normaliseControlPoints];



export const reloadSelectionOverlay: SimpleTicket = {

  instructionGroup: "layerDraw",
  instruction: "Draw selection parallelogram overlay",
  processor: MouseProcessor.drawSelectionOverlay,
  log: false

}; ticketArray = [...ticketArray, reloadSelectionOverlay];



export const reloadSecondaryEntities: SimpleTicket = {

  instructionGroup: "mouse",
  instruction: "update secondary entities",
  processor: FSMutator.reloadSecondaryEntities,
  log: true

}; ticketArray = [...ticketArray, reloadSecondaryEntities];



export const definedTickets = ticketArray;
