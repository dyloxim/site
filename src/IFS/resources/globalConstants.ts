import { defaultDisplay } from '@IFS/resources/presets/displayPresets';
import { default as AppEngine } from "@IFS/app";
import { FunctionSystems } from '@IFS/resources/presets/FSPresets';
import { I_session } from '@IFS/types/state';

/*
 * Predefined layers for image composer
 * ------------------------------------
 */

export const DefinedDisplayLayers = [
  "grid",
  "figure",
  "pathOverlay",
  "controlPointsOverlay",
  "selectionOverlay",
  "hoverOverlay",
] as const;




/*
 * Named Function System Presets:
 * ------------------------------
 */

export const NamedFSPresets = [
  "barnsleyFern",
  "sierpinskiGasket",
  "colorSpace",
  "sierpinskiPentagon",
  "kochSnowflake",
  "kochCurve",
  "binaryTree",
  "heighwayDragon",
] as const;



/*
 * Instruction Groups
 * ------------------
 */

export const InstructionGroups = [
  "mouse",
  "FS",
  "rig",
  "IFSprocess",
  "layerErase",
  "layerDraw"
] as const;


/*
 * Selectable Entity Categories
 * -----------------------------
 */

export const SelectableEntityCategories = [
  "primaryControlPoints",
  "secondaryControlPoints"
] as const;




/*
 * Defined Action Tickets
 * ----------------------
 */


export const DefinedTickets = [

  ["HANDLE",
    
    
      "MouseMoveEvent",
      "MouseDownEvent",
      "showHoverTarget",
      "revertRigToInitial",
      "normaliseControlPoints",
      "reloadSelectionOverlay"
    ],

  ["RELOAD",

    [
      "rig", "FS", "controlPoints", "selectionOverlay"
    ]],

  ["REBUILd",

    [
      "rig"
    ]],

  ["REVIEW",

    [
      "controlPoints"
    ]],

  ["DO",

    [
      "showHoverTarget",
      "revertRigToInitial",
      "normaliseControlPoints",
    ]],

];






/*
 * Option Values
 * -------------
 */

export const PathOptions = ["None", "Fleeting", "Persistent"]





/*
 * Default drawn UI entity parameters
 * ----------------------------------
 */

export const vertRadiusDisplayRatio = 1/80;
export const selectionRadiusDisplayRatio = 1/20;

export const panStepSizeDisplayRatio = 1/8;
export const incrementUnit = 7/8;

export const pathDrawThreshold = 10000;

export const decisionTimeoutThreshold = 180;

export const defaultPreset = {
  display: defaultDisplay,
  FS: FunctionSystems.heighwayDragon
}

export const defaultInitialSession: I_session = {
  settings: defaultPreset,
  state: AppEngine.getInitialState(defaultPreset) 
}
