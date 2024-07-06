
/*
 * Predefined layers for image composer
 * ------------------------------------
 */

export const DisplayLayers = [
  "grid",
  "figure",
  "pathOverlay",
  "bboxesOverlay",
  "selectionOverlay",
] as const;



/*
 * Named Function System Presets:
 * ------------------------------
 */

export const NamedFSPresets = [
  "barnsleyFern",
  "sierpinskiGasket",
  "sierpinskiPentagon",
  "kochSnowflake",
  "kochCurve",
  "binaryTree",
  "heighwayDragon",
] as const;



/*
 * Default drawn UI entity parameters
 * ----------------------------------
 */

export const vertRadiusDisplayRatio = 1/140;
export const selectionRadiusDisplayRatio = 1/20;

export const panStepSizeDisplayRatio = 1/8;
export const zoomIncrementStep = 7/8;
export const resolutionIncrementStep = 1.1;

export const pathDrawThreshold = 100000;
