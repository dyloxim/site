// import { I_session } from '@IFS/types/execution'
// import { Vector } from './math';
// import { NamedFSPreset } from './types/specifications';
// import { FunctionSystems } from '@IFS/resources/presets/FSPresets';
// 
// type SessionEffect = (session: I_session, ...parameters: any) => I_session;
// 
// export default class Interact {
// 
// 
//   static  = () => {}
// 
//   static freeze(session: I_session): I_session {
//     session.state.animation.running = false;
//     session.state.interaction.updatePending = true;
//     return session;
//   }
// 
//   static resume(session: I_session): I_session {
//     session.state.animation.running = true;
//     session.state.interaction.updatePending = true;
//     return session;
//   }
// 
//   // rigChange
//   static setShowBboxes(val: boolean, session: I_session) {
//     session.settings.display.overlays.boundingBoxes = val;
//     session.state.interaction.rigChanged = true
//     session.state.interaction.updatePending = true;
//     return session;
//   }
// 
//   // rigChange
//   static setShowLastPath(val: boolean, session: I_session) {
//     session.settings.display.overlays.path.showLast = val;
//     session.state.interaction.rigChanged = true
//     session.state.interaction.updatePending = true;
//     return session;
//   }
// 
//   // rigChange
//   static setPathPersist(val: boolean, session: I_session) {
//     session.settings.display.overlays.path.persist = val;
//     session.state.interaction.rigChanged = true
//     session.state.interaction.updatePending = true;
//     return session;
//   }
// 
//   static setMouseDown(session: I_session) {
//     session.state.interaction.mouseDown = true
//     session.state.interaction.updatePending = true;
//   }
// 
//   static setMouseUp(session: I_session) {
//     session.state.interaction.mouseDown = false
//     session.state.interaction.updatePending = true;
//   }
// 
//   // rigChange
//   static setColorStyle(useMulti: boolean, session: I_session) {
//     session.settings.display.color.multi = useMulti;
//     session.state.interaction.updatePending = true;
//     session.state.interaction.rigChanged = true
//     return session;
//   }
// 
//   // rigChange
//   static pan(v: number[], session: I_session) {
//     let currentOrigin = session.settings.display.domain.origin
//     session.settings.display.domain.origin = Vector.add(
//       currentOrigin, v);
//     session.state.interaction.rigChanged = true;
//     session.state.interaction.updatePending = true;
//     return session;
//   }
// 
//   // rigChange
//   static zoom(zoomFactor: number, session: I_session) {
//     let currentDisplayRad = session.settings.display.domain.displayRadius;
//     session.settings.display.domain.displayRadius = currentDisplayRad / zoomFactor;
//     session.state.interaction.rigChanged = true
//     session.state.interaction.updatePending = true;
//     return session;
//   }
// 
//   static setAnimationRate(stepsPerFrame: number, session: I_session) {
//     session.settings.display.animation.rate = stepsPerFrame;
//     session.state.interaction.updatePending = true;
//     return session;
//   }
// 
//   // rigChange
//   static updateResolutionScaling(changeFactor: number, session: I_session) {
//     let currentFactor = session.settings.display.rendering.upscaleFactor;
//     session.settings.display.rendering.upscaleFactor = currentFactor * changeFactor;
//     session.state.interaction.rigChanged = true;
//     session.state.interaction.updatePending = true;
//     return session;
//   }
// 
//   // mouseMoved
//   static updateMousePos(pos: {x: number, y: number}, session: I_session) {
//     if (pos.x !== Infinity && pos.y !== Infinity) {
//       session.state.interaction.canvasMousePos.x = pos.x;
//       session.state.interaction.canvasMousePos.y = pos.y;
//       session.state.interaction.mouseMoved = true;
//       session.state.interaction.updatePending = true;
//     }
//     return session;
//   }
// 
// 
//   static loadFSPreset(preset: NamedFSPreset, session: I_session) {
//     session.settings.FS = FunctionSystems[preset];
//     session.state.interaction.FSChanged = true;
//     session.state.interaction.rigChanged = true;
//     session.state.interaction.updatePending = true;
//     return session;
//   }
// 
// }
