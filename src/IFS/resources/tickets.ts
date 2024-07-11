import IFSAppWorker from "@IFS/execution/IFSAppWorker";
import MouseProcessor from "@IFS/execution/mouseProcessor";
import { DisplayLayer } from "@IFS/types/specifications";
import { SimpleTicket, BasicLayerTicket, LayerTicketInstructionString } from "@IFS/types/tickets"

/*
 * convenience function for generating tickets requesting basic layer changes
 */


export const generateBasicLayerTicket = (
  instructionGroup: "layerErase" | "layerDraw",
  layer: DisplayLayer,
  instruction: LayerTicketInstructionString
): BasicLayerTicket => {
  return {
    consumer: layer,
    instructionGroup: instructionGroup,
    instruction: instruction,
    processor: IFSAppWorker.processCommonLayerTicket
  }
};



/*
 * List of specially predefined tickets
 */

let ticketArray: SimpleTicket[] = [];

export const reloadRig: SimpleTicket = {
  instructionGroup: "rig",
  instruction: "loadFromSettings",
  processor: IFSAppWorker.loadRigFromSettings
}; ticketArray = [...ticketArray, reloadRig];

export const reloadFS: SimpleTicket = {
  instructionGroup: "FS",
  instruction: "loadFromSettings",
  processor: IFSAppWorker.loadFSFromSettings
}; ticketArray = [...ticketArray, reloadFS];

export const interpretFSMutation: SimpleTicket = {
  instructionGroup: "FS",
  instruction: "readFromMouseInteraction",
  processor: IFSAppWorker.readFSfromMouseInteraction
}; ticketArray = [...ticketArray, interpretFSMutation];

export const reloadBboxes: SimpleTicket = {
  instructionGroup: "layerDraw",
  instruction: "loadFromSettings",
  processor: IFSAppWorker.loadBboxesFromSettings
}; ticketArray = [...ticketArray, reloadBboxes];

export const drawSelectionOverlay: SimpleTicket = {
  instructionGroup: "rig",
  instruction: "loadFromSettings",
  processor: IFSAppWorker.drawSelectionOverlays
}; ticketArray = [...ticketArray, reloadBboxes];

export const handleBboxVisibilityChange: SimpleTicket = {
  instructionGroup: "rig",
  instruction: "loadFromSettings",
  processor: IFSAppWorker.drawSelectionOverlays
}; ticketArray = [...ticketArray, reloadBboxes];

export const handleMouseMoveEvent: SimpleTicket = {
  instructionGroup: "mouse",
  instruction: "handleMove",
  processor: MouseProcessor.handleMoveEvent
}; ticketArray = [...ticketArray, reloadBboxes];

export const handleMousePressEvent: SimpleTicket = {
  instructionGroup: "mouse",
  instruction: "handleMove",
  processor: MouseProcessor.handlePressEvent
}; ticketArray = [...ticketArray, reloadBboxes];

export const highlightSelection: SimpleTicket = {
  instructionGroup: "mouse",
  instruction: "highlightSelection",
  processor: MouseProcessor.highlightSelection
}; ticketArray = [...ticketArray, reloadBboxes];

export const revertToRigToInitial: SimpleTicket = {
  instructionGroup: "mouse",
  instruction: "highlightSelection",
  processor: IFSAppWorker.revertRigToInitial
}; ticketArray = [...ticketArray, reloadBboxes];

export const definedTickets = ticketArray;
