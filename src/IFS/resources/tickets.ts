import IFSAppWorker from "@IFS/execution/IFSAppWorker";
import MouseProcessor from "@IFS/execution/mouseProcessor";
import { DisplayLayer } from "@IFS/types/specifications";
import { SimpleTicket, BasicLayerTicket } from "@IFS/types/tickets"

/*
 * convenience function for generating tickets requesting basic layer changes
 */


export const generateBasicLayerTicket = (
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
    processor: IFSAppWorker.processCommonLayerTicket
  }
};



/*
 * List of specially predefined tickets
 */

let ticketArray: SimpleTicket[] = [];

export const reloadRig: SimpleTicket = {
  instructionGroup: "rig",
  instruction: "Load rig from settings",
  processor: IFSAppWorker.loadRigFromSettings
}; ticketArray = [...ticketArray, reloadRig];

export const reloadFS: SimpleTicket = {
  instructionGroup: "FS",
  instruction: "Load FS from settings",
  processor: IFSAppWorker.loadFSFromSettings
}; ticketArray = [...ticketArray, reloadFS];

export const reloadBboxes: SimpleTicket = {
  instructionGroup: "layerDraw",
  instruction: "Load FS handle overlays from settings",
  processor: IFSAppWorker.loadBboxesFromSettings
}; ticketArray = [...ticketArray, reloadBboxes];

export const handleMouseMoveEvent: SimpleTicket = {
  instructionGroup: "mouse",
  instruction: "Handle mouse move event",
  processor: MouseProcessor.handleMoveEvent
}; ticketArray = [...ticketArray, reloadBboxes];

export const handleMousePressEvent: SimpleTicket = {
  instructionGroup: "mouse",
  instruction: "Handle mouse press event",
  processor: MouseProcessor.handlePressEvent
}; ticketArray = [...ticketArray, reloadBboxes];

export const highlightSelection: SimpleTicket = {
  instructionGroup: "layerDraw",
  instruction: "highlightSelection",
  processor: MouseProcessor.highlightSelection
}; ticketArray = [...ticketArray, reloadBboxes];

export const revertToRigToInitial: SimpleTicket = {
  instructionGroup: "mouse",
  instruction: "highlightSelection",
  processor: IFSAppWorker.revertRigToInitial
}; ticketArray = [...ticketArray, reloadBboxes];

export const setSwitch_MutatingFS: SimpleTicket = {
  instructionGroup: "mouse",
  instruction: "Begin FS mutation interaction",
  processor: MouseProcessor.setFSMutationSwitch
}; ticketArray = [...ticketArray, reloadBboxes];

export const unsetSwitch_MutatingFS: SimpleTicket = {
  instructionGroup: "mouse",
  instruction: "End FS mutation interaction",
  processor: MouseProcessor.unsetFSMutationSwitch
}; ticketArray = [...ticketArray, reloadBboxes];

export const definedTickets = ticketArray;
