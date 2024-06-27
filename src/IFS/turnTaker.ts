import { default as Util } from "@IFS/util";
import { default as functionSystem } from "@IFS/functionSystem";
import { default as Display } from "@IFS/display/displayApperatus"

import { I_state } from "@IFS/types/operationTypes";
import { I_settings } from "./types/configTypes";

export default class TurnTaker {

  // process management

  static setup = (
    settings: I_settings,
    state: I_state,
    FS: functionSystem,
    display: Display
  ): void => {
    if (settings.display.overlays.boundingBoxes)
      TurnTaker.drawBoundingBoxes(settings, state, FS, display);
  }

  static runItteration = (
    settings: I_settings,
    state: I_state,
    FS: functionSystem,
    display: Display
  ): void => {

    Array.from({ length: settings.display.animation.rate }, _ => null).forEach(_ => {

      // deprecate current position
      state.program.lastTurn = state.program.thisTurn

      // choose new function and get position of current point under transformation
      let choice = Util.getWeightedRandomChoice(FS.weights)
      let newPosition = FS.transforms[choice]
        .apply(state.program.thisTurn.position)

      // update state
      state.program.thisTurn.choice = choice;
      state.program.thisTurn.position = newPosition

      // register new point on workpiece
      TurnTaker.markCurrentPoint(settings, state, display);

      if (settings.display.overlays.path.showLast)
        TurnTaker.markLastPath(settings, state, display)
    });

    display.renderer.layers.figure.commit();

  }


  // state interpretation

  static readSettings = (settings: I_settings, state: I_state, display: Display): void => {
    if (state.interaction.updatePending) {
      TurnTaker.handlePossibleRedraw(settings, state, display);
      state.interaction.updatePending = false;
    }
  }

  static handlePossibleRedraw = (
    settings: I_settings,
    state: I_state,
    display: Display): void => {
    if (state.interaction.wantsRedraw) {
      display.reconstruct(settings.display);
      state.interaction.wantsRedraw = false;
    }
  }


  // straightforward drawing functions

  static markCurrentPoint = (settings: I_settings, state: I_state, display: Display): void => {
    display.addPoint(
      display.renderer.layers.figure,
      state.program.thisTurn.position,
      Util.getThisTurnColor(settings, state)
    );
  }

  static markLastPath = (settings: I_settings, state: I_state, display: Display): void => {
    // erase prior path
    if (!settings.display.overlays.path.persist)
      display.renderer.layers.pathOverlay.clear();
    // dont draw last path if steps/frame is high
    if (settings.display.animation.rate < 10) {
      display.addLine(
        display.renderer.layers.pathOverlay,
        state.program.thisTurn.position,
        state.program.lastTurn.position,
        Util.getThisTurnColor(settings, state)
      );
    }
    display.renderer.layers.pathOverlay.commit();
  }

  static drawBoundingBoxes = (
    settings: I_settings,
    state: I_state,
    FS: functionSystem,
    display: Display
  ): void => {

  }


}
