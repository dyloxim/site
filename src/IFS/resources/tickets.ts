import FSMutator from "@IFS/execution/FSMutator";
import IFSAppWorker from "@IFS/execution/IFSAppWorker";
import MouseProcessor from "@IFS/execution/mouseProcessor";
import { DisplayLayer } from "@IFS/types/specifications";
import { BasicLayerTicket, ActionRegistry, LayerActionKey } from "@IFS/types/tickets"

/*
 * convenience function for generating tickets requesting basic layer changes
 */


export const layerUpdateAction = (
  instruction: LayerActionKey,
  layers: DisplayLayer[],
): BasicLayerTicket => {
  return {
    consumer: layers,
    instructionGroup: `${(new Map([
      ["ERASE", "layerErase"],
      ["DRAW", "layerDraw"]
    ]).get(instruction) as "layerErase" | "layerDraw")}`,
    instruction: `${instruction} layers: ${layers}`,
    processor: IFSAppWorker.processLayerTicket,
    log: false
  }
};



export const Actions: ActionRegistry = {
  
  "HANDLE:mouseMoveEvent": {
      instructionGroup: "mouse",
      instruction: "Handle mouse move event",
      processor: MouseProcessor.handleMoveEvent,
      log: false
    },

  "HANDLE:mouseDownEvent": {
    instructionGroup: "mouse",
    instruction: "Handle mouse down event",
    processor: MouseProcessor.handleMouseDownEvent,
    log: false
  },
  
  "RELOAD:rig": {
      instructionGroup: "rig",
      instruction: "Load rig from settings",
      processor: IFSAppWorker.loadRigFromSettings,
      log: false
    },

  "RELOAD:FS": {
    instructionGroup: "FS",
    instruction: "Load FS from settings",
    processor: IFSAppWorker.loadFSFromSettings,
    log: false
  },

  "RELOAD:controlPoints": {
    instructionGroup: "layerDraw",
    instruction: "Load FS handle overlays from settings",
    processor: IFSAppWorker.loadControlPointsFromSettings,
    log: false
  },

  "RELOAD:selectionOverlay": {
    instructionGroup: "layerDraw",
    instruction: "Draw selection parallelogram overlay",
    processor: MouseProcessor.drawSelectionOverlay,
    log: false
  },

  "RELOAD:secondaryEntities": {
    instructionGroup: "mouse",
    instruction: "load secondary entities",
    processor: FSMutator.reloadSecondaryEntities,
    log: false
  },
  


  
  "REBUILD:rig": {
      instructionGroup: "rig",
      instruction: "Replace display layers with new canvases and then load rig from settings",
      processor: IFSAppWorker.reconstructRig,
      log: false
    },

  

  
  "REVIEW:controlPoints": {
      instructionGroup: "layerErase",
      instruction: "Consult settings and dispatch required tickets for control points overlay",
      processor: IFSAppWorker.reviewControlPointsConfig,
      log: false
    },



  
  "DO:showHoverTarget": {
      instructionGroup: "layerDraw",
      instruction: "show hover target",
      processor: MouseProcessor.showHoverTarget,
      log: false
    },

  "DO:revertRigToInitial": {
    instructionGroup: "rig",
    instruction: "revert rig to initial",
    processor: IFSAppWorker.revertRigToInitial,
    log: false
  },

  "DO:normaliseControlPoints": {
    instructionGroup: "FS",
    instruction: "Normalise Control Points",
    processor: IFSAppWorker.normaliseControlPoints,
    log: false
  },

  "DO:drawSelectionOverlay": {
    instructionGroup: "layerDraw",
    instruction: "draw secondary entities",
    processor: MouseProcessor.drawSelectionOverlay,
    log: false
  },

  "DO:clearSelection": {
    instructionGroup: "mouse",
    instruction: "unload and erase all selectable entities",
    processor: MouseProcessor.clearSelection,
    log: false
  },

  "DO:calibrateDisplay": {
    instructionGroup: "mouse",
    instruction: "unload and erase all selectable entities",
    processor: IFSAppWorker.calibrateDisplay,
    log: false
  }

}
  
