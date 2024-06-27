import Color from "./display/util/color";
import { I_settings } from "./types/configTypes";
import { I_state } from "./types/operationTypes";

export default class Util {

  static pathDrawThreshold = 10;

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

  static getThisTurnColor = (settings: I_settings, state: I_state): Color => {
    if (settings.display.color.multi) {
      return settings.display.color
        .palette.colors[state.program.thisTurn.choice];
    } else {
      return settings.display.color.base;
    }
  }

  static shouldErasePreviousPaths = (settings: I_settings): boolean => {
    return (settings.display.overlays.path.showLast
      && !settings.display.overlays.path.persist
      && settings.display.animation.rate <= Util.pathDrawThreshold)
  }

  static shouldMarkLastPath = (settings: I_settings): boolean => {
    return (settings.display.overlays.path.showLast
      && settings.display.animation.rate <= Util.pathDrawThreshold)
  }

}
