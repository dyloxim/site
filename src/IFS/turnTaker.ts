import { default as Display } from "@IFS/display/displayApperatus"
import { NoColor } from "@IFS/resources/colors"

import { I_settings } from "./types/configTypes"
import { I_state } from "./types/operationTypes"
import Util from "./util"
import functionSystem from "./functionSystem"

export default class TurnTaker {

  static doFirstDraw = (
    settings: I_settings,
    state: I_state,
    display: Display
  ): void => {
    TurnTaker.ensureConfigApplied(settings, state, display!)
  }

  static handleTurn = (
    stepsPerFrame: number,
    settings: I_settings,
    state: I_state,
    FS: functionSystem,
    display: Display
  ) => {
    TurnTaker.prepareTurn(settings, state, display);
    Array.from({ length: stepsPerFrame }, _ => TurnTaker.takeTurn(settings, state, FS, display))
    TurnTaker.afterTurn(settings, state, display)
  }

  static takeTurn = (
    settings: I_settings,
    state: I_state,
    FS: functionSystem,
    display: Display
  ) => {
    TurnTaker.movePiece(settings, state, FS, display)
    if (Util.shouldMarkLastPath(settings))
      TurnTaker.markLastPath(settings, state, display)
  }

  static ensureConfigApplied = (
    settings: I_settings,
    state: I_state,
    display: Display
  ): void => {
    if (state.interaction.updatePending) {
      if (settings.display.animation.rate >= Util.pathDrawThreshold)
        display.clearPathOverlay();
      TurnTaker.handlePossibleRedraw(settings, state, display);
      state.interaction.updatePending = false;
    }
  }

  private static prepareTurn = (
    settings: I_settings,
    state: I_state,
    display: Display
  ) => {
    TurnTaker.ensureConfigApplied(settings, state, display);
    if (Util.shouldErasePreviousPaths(settings))
      TurnTaker.erasePreviousPaths(settings, state, display);
  }

  private static afterTurn = (
    settings: I_settings,
    state: I_state,
    display: Display
  ) => {
  }

  static updateAppropriateLayers = (settings: I_settings, display: Display): void => {
    // if animation loop is running, (where this function is called from),
    // the figure layer always needs updating
    display?.updateFigure()
    // path overlay only needs updating if path overlays are active
    if (Util.shouldMarkLastPath(settings))
      display?.updatePathOverlay();
  }

  static handlePossibleRedraw = (settings: I_settings, state: I_state, display: Display) => {
    if (state.interaction.wantsRedraw) {
      display.renderer.reconstructAll(settings.display);
      display.rig.reconstruct(settings.display, display.renderer.getPrintArea());
      state.interaction.wantsRedraw = false;
    }
  }

  static movePiece = (
    settings: I_settings,
    state: I_state, FS: functionSystem,
    display: Display
  ) => {
    // deprecate current position
    state.program.lastTurn = state.program.thisTurn

    // choose new function and get position of current point under transformation
    let choice = Util.getWeightedRandomChoice(FS.weights)
    let newPosition = FS.transforms[choice]
      .apply(state.program.thisTurn.position)

    // update state
    state.program.thisTurn = { choice: choice, position: newPosition }

    // register new point on workpiece
    display?.draftPoint(
      display.renderer.layers.figure,
      state.program.thisTurn.position,
      Util.getThisTurnColor(settings, state)
    );
  }

  static markLastPath = (settings: I_settings, state: I_state, display: Display): void => {
    // dont draw last path if steps/frame is high
    display?.draftLine(
      display?.renderer.layers.pathOverlay,
      state.program.thisTurn.position,
      state.program.lastTurn.position,
      Util.getThisTurnColor(settings, state)
    );
    display?.updatePathOverlay();
  }

  static erasePreviousPaths = (
    settings: I_settings,
    state: I_state,
    display: Display
  ): void => {
    // dont draw last path if steps/frame is high
    if (Util.shouldErasePreviousPaths(settings))
      display?.clearPathOverlay();
  }

  static drawBoundingBoxes = (): void => {

  }

}
