
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
  "serpinskiCarpet",
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
 * Default drawn UI entity parameters
 * ----------------------------------
 */

export const vertRadiusDisplayRatio = 1/80;
export const selectionRadiusDisplayRatio = 1/30;

export const panStepSizeDisplayRatio = 1/8;
export const zoomIncrementStep = 7/8;
export const resolutionIncrementStep = 1.1;

export const pathDrawThreshold = 10000;

export const decisionTimeoutThreshold = 150;
