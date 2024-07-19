import { default as SessionMutation } from "@IFS/execution/sessionMutation";
import { default as Vec } from "@IFS/math/linearAlgebra/vec2"

import { AppStateProcessor, I_selectableEntityMetaData } from "@IFS/types/interaction";
import { I_applicationState } from "@IFS/types/state";

import * as CommonTickets from "@IFS/resources/tickets"
import MouseProcessor from "./mouseProcessor";
import Util from "./util";

export default class FSMutator {



  static mutateFS: AppStateProcessor = (app): void => {

    switch(app.session.state.mouse.interactionCandidate?.type) {

      case "primaryControlPoints":

        FSMutator.mutateTranslationComponent(app);
        break;

      case "secondaryControlPoints":

        FSMutator.mutateLinearComponent(app);
        break; 

    }

  }

  

  static reloadSecondaryEntities: AppStateProcessor = app => {

    let newEntities = Util.getSelectionControlPoints(app);

    if (newEntities != null) {

    app.session = new SessionMutation({ session: app.session, assertion: s => {

      s.state.selectableEntities.secondaryControlPoints = newEntities;

      return s;}, ticketsGetter: _ => []}).gives();

      MouseProcessor.drawSelectionOverlay(app);
    }
  }



  static mutateTranslationComponent: AppStateProcessor = app => {

    app.display.imageComposer.layers.hoverOverlay.clear();
    app.display.imageComposer.layers.controlPointsOverlay.clear();

    if (app.session.state.mouse.activeSelection.length == 1) {

      app.display.imageComposer.layers.selectionOverlay.clear();

    }

    let i = app.session.state.mouse.interactionCandidate!.id[0];

    let newPos = Vec.minus(
      app.display.rig.reverseProject(app.session.state.mouse.pos),
      app.session.state.mouse.controlPointOffset!
    )

    app.session = new SessionMutation({session: app.session, assertion: s => {

      if (s.state.mouse.activeSelection.length == 1 && s.state.mouse.activeSelection[0] != i) {
        s.state.mouse.activeSelection = [];
      }

      s.state.mouse.interactionCandidate!.pos = newPos;
      s.settings.FS.transforms[i] = {

        linear:  app.FS.controlPoints[i].basis,
        translation: newPos

      }; return s;

    }, ticketsGetter: s => {

      let tickets = [CommonTickets.reloadFS, CommonTickets.reloadControlPoints]

      if (s.state.mouse.activeSelection.length == 1) {
        tickets = [...tickets, CommonTickets.reloadSecondaryEntities]
      }

      return tickets; }}).gives()

  }




  
  static mutateLinearComponent(app: I_applicationState) {

    let [i, j] = app.session.state.mouse.interactionCandidate!.id;

    let newPos = Vec.minus(
      app.display.rig.reverseProject(app.session.state.mouse.pos),
      app.session.state.mouse.controlPointOffset!
    )

    let newLinear = app.FS.controlPoints[i].basis;
    newLinear[j] = Vec.minus(newPos, app.FS.controlPoints[i].origin);

    app.session = new SessionMutation({session: app.session, assertion: s => {

      s.state.mouse.interactionCandidate!.pos = newPos;
      s.settings.FS.transforms[i] = {

        linear: newLinear,
        translation: app.FS.controlPoints[i].origin

      }; return s;

    }, ticketsGetter: _ => [

      CommonTickets.reloadFS,

    ]}).gives()

    MouseProcessor.handleNewSelection(app);

  }




}
