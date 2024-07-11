import { default as Color } from "@IFS/display/util/color";
import { default as Display } from "@IFS/display/displayApperatus";

import { I_settings } from "@IFS/types/configuration";
import { I_applicationState, I_sessionState } from "@IFS/types/state";

import * as Globals from "@IFS/resources/globalConstants"

export default class Util {

  static getWeightedRandomChoice = (weights: number[]): number => {
    let probabilitySum = weights[0]
    let regions = weights.slice();
    for (let i = 1; i < weights.length; i++) {
      probabilitySum += weights[i]
      regions[i] = probabilitySum;
    }
    let dart = Math.random()
    let choice = 0
    for (let i = 0; i < weights.length; i++) {
      if (regions[i] > dart) { choice = i; break; }
    }
    return choice;
  }

  static getThisTurnColor = (settings: I_settings, state: I_sessionState): Color => {
    if (state.options.color) {
      return settings.display.color
        .palette.colors[state.program.thisTurn.choice];
    } else {
      return settings.display.color.base;
    }
  }

  static getVertRadius = (settings: I_settings): number => {
    return settings.display.domain.displayRadius * Globals.vertRadiusDisplayRatio
  }

  static getVertPixelRadius = (settings: I_settings, display: Display): number => {
    return display.rig.projectLength(Util.getVertRadius(settings))
  }

  static getSelectionRadius = (settings: I_settings): number => {
    return settings.display.domain.displayRadius * Globals.selectionRadiusDisplayRatio;
  }

  static getSelectionPixelRadius = (appState: I_applicationState): number => {
    return appState.display.rig.projectLength(
      Util.getSelectionRadius(appState.session.settings)
    )
  }

}
