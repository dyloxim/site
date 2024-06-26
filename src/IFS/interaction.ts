import I_session from '@IFS/types/I_session'
// import Render from '@IFS/display/render';
import { Vector } from './math';

export default class Interact {

  static freeze(session: I_session): I_session {
    session.state.animation.running = false;
    session.state.interaction.updatePending = true;
    return session;
  }

  static resume(session: I_session): I_session {
    session.state.animation.running = true;
    session.state.interaction.updatePending = true;
    return session;
  }

  static pan(v: number[], session: I_session) {
    let currentOrigin = session.settings.display.domain.origin
    session.settings.display.domain.origin = Vector.add(
      currentOrigin, v);
    session.state.interaction.wantsRedraw = true
    session.state.interaction.updatePending = true;
    return session
  }

  static zoom(zoomFactor: number, session: I_session) {
    let currentDisplayRad = session.settings.display.domain.displayRadius;
    session.settings.display.domain.displayRadius = currentDisplayRad / zoomFactor;
    session.state.interaction.wantsRedraw = true
    session.state.interaction.updatePending = true;
    return session
  }

  static setAnimationRate(stepsPerFrame: number, session: I_session) {
    session.settings.animation.rate = stepsPerFrame;
    session.state.interaction.updatePending = true;
    return session
  }

  static setColorStyle(useMulti: boolean, session: I_session) {
    session.settings.display.color.multi = useMulti;
    session.state.interaction.wantsRedraw = true
    session.state.interaction.updatePending = true;
    return session
  }

  static updateResolutionScaling(changeFactor: number, session: I_session) {
    let currentFactor = session.settings.display.rendering.upscaleFactor
    session.settings.display.rendering.upscaleFactor = currentFactor * changeFactor;
    session.state.interaction.wantsRedraw = true
    session.state.interaction.updatePending = true;
    return session
  }

}
