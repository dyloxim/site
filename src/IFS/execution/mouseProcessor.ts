import { AppStateProcessor, I_selectableEntityMetaData, SelectableEntityCategory, TicketProcessor } from "@IFS/types/interaction"

import { default as FSMutator } from "@IFS/execution/FSMutator";
import { default as SessionMutation } from "@IFS/execution/sessionMutation";

import { default as Color } from "@IFS/display/util/color";
import { default as Vec } from "@IFS/math/linearAlgebra/vec2"
import { default as Util } from "@IFS/execution/util";

import * as CommonTickets from "@IFS/resources/tickets"
import * as Globals from "@IFS/resources/globalConstants"

export default class MouseProcessor {


  // entry points


  static handleMoveEvent: AppStateProcessor = app => {

    if (app.session.state.options.controlPointsShown) {

      if (app.session.state.tacit.mutatingFS) FSMutator.mutateFS(app);

      if (!app.session.state.mouse.down) MouseProcessor.processProximities(app);

    }

    if (app.session.state.tacit.draggingRig) MouseProcessor.translateRig(app);

  }


  static handlePressEvent: AppStateProcessor = app => {

    if (app.session.state.mouse.down) MouseProcessor.handleMouseDownEvent(app);
    else MouseProcessor.handleMouseUpEvent(app);

  }


  static handleMouseDownEvent: AppStateProcessor = app => {

    app.session = new SessionMutation({ session: app.session, assertion: s => {

      s.state.mouse.actionUndecided = Date.now();
      s.state.mouse.controlPointOffset = Util.getControlPointOffset(app)

      if (s.state.mouse.controlPointOffset != null) {
        s.state.mouse.interactionPrimed = true;
      }

      return s;

    }, ticketsGetter: _ => []}).gives();

  }


  static endFSMutationInteraction: AppStateProcessor = app => {

    app.session = new SessionMutation({ session: app.session, assertion: s => {

      s.state.mouse.interactionPrimed = false;
      s.state.mouse.interactionCandidate = null;

      s.state.mouse.controlPointOffset = null;
      s.state.tacit.mutatingFS = false;

      return s;

    }, ticketsGetter: _ => [
      CommonTickets.handleMouseMoveEvent,
      CommonTickets.reviewControlPointsConfig
    ] }).gives();
  }


  static endRigDragInteraction: AppStateProcessor = app => {

      app.session = new SessionMutation({ session: app.session, assertion: s => {

        s.state.mouse.interactionPrimed = false;
        s.state.mouse.interactionCandidate = null;

        s.state.tacit.draggingRig = null;

        return s

      }, ticketsGetter: _ => [CommonTickets.handleMouseMoveEvent]}).gives();
  }

  
  static handleMouseUpEvent: AppStateProcessor = app => {

    app.display.imageComposer.layers.selectionOverlay.clear()

    if (app.session.state.tacit.mutatingFS) {

      MouseProcessor.endFSMutationInteraction(app);

    } else if (app.session.state.tacit.draggingRig) {

      MouseProcessor.endRigDragInteraction(app);

    }

  }


  static maybeDecideMouseAction: AppStateProcessor = app => {

    if (Util.interactionDecisionTimedOut(app)) {

      app.session.state.mouse.actionUndecided = null;

      if (app.session.state.mouse.down) {

        MouseProcessor.beginDragInteraction(app);

      } else {

        
        MouseProcessor.handleClickEvent(app);

      }

    }

  }


  // actions


  static beginDragInteraction: AppStateProcessor = app => {

    app.display.imageComposer.layers.hoverOverlay.clear();
    app.display.imageComposer.layers.selectionOverlay.clear();

    if (app.session.state.mouse.interactionPrimed) {


      app.session = new SessionMutation({ session: app.session, assertion: s => {

        s.state.tacit.mutatingFS = true;

        return s;}, ticketsGetter: _ => [

            CommonTickets.generateBasicLayerTicket("erase", ["hoverOverlay"]),
            CommonTickets.reviewControlPointsConfig

        ]}).gives();


    } else {

      app.session = new SessionMutation({ session: app.session, assertion: s => {

        let initialDragPos = app.session.settings.display.domain.origin;
        s.state.tacit.draggingRig = initialDragPos;

        return s;}, ticketsGetter: _ => []}).gives();

    }
  }


  static processProximities: AppStateProcessor = app => {

    let oldTarget = app.session.state.mouse.interactionCandidate;
    let newTarget: null | I_selectableEntityMetaData = null;

    // loop through loaded entities

    newTarget = Globals.SelectableEntityCategories
      .map(category => { return Util.processEntityCategoryProximities(app, category); })
      .reduce((a, b) => { return b ?? a });

    if (Util.interactionCandidateChanged(app, newTarget)) {
      
      app.session = new SessionMutation({ session: app.session, assertion: s => {

        s.state.mouse.interactionCandidate = newTarget;
        return s;

      }, ticketsGetter: s =>  { switch(

        !!s.state.mouse.interactionCandidate 

        // true when target has become proximal, 
        //  false when target has become null

      ) {

        case true: 

          return [CommonTickets.showHoverTarget]

        case false:

          if (Util.targetEqualsSelection(app, oldTarget)) return [];

          else return [
            CommonTickets.generateBasicLayerTicket("erase", ["hoverOverlay"]),
            CommonTickets.reviewControlPointsConfig
          ];

        default:
          return [];

      }}}).gives()

    }

  }


  static handleSecondaryControlPointClicked: AppStateProcessor = app => {}


  static handleNewSelection: AppStateProcessor = app => {

    app.display.imageComposer.layers.selectionOverlay.clear();
    app.display.imageComposer.layers.hoverOverlay.clear();

    let target = app.session.state.mouse.interactionCandidate!

    let i = target.id[0]
    let K = app.FS.controlPoints[i];

    let newEntities: I_selectableEntityMetaData[] = K.basis .map((v, j) => {

      return {
        id: [i, j],
        type: "secondaryControlPoints",
        pos: Vec.add(K.origin, v),
        isProximal: false
      }});


    app.session = new SessionMutation({ session: app.session, assertion: s => {

      s.state.mouse.activeSelection = [i];
      s.state.selectableEntities.secondaryControlPoints = newEntities;

      return s;}, ticketsGetter: _ => [

      CommonTickets.handleMouseMoveEvent

    ]}).gives();

    MouseProcessor.drawSelectionOverlay(app);

  }


  static clearSelection: AppStateProcessor = app => {

    app.session = new SessionMutation({ session: app.session, assertion: s => {


      s.state.mouse.activeSelection = [];
      s.state.mouse.interactionPrimed = false;
      s.state.selectableEntities.secondaryControlPoints = [];
      s.state.selectableEntities.primaryControlPoints = [];

      return s;

    }, ticketsGetter: _ => [

      CommonTickets.reviewControlPointsConfig,
      CommonTickets.handleMouseMoveEvent

    ]}).gives();

  }


  static handleClickEvent: AppStateProcessor = app => {

    app.session = new SessionMutation({ session: app.session, assertion: s => {
      s.state.mouse.interactionPrimed = false;
      return s;}, ticketsGetter: _ => []}).gives();

    let target = app.session.state.mouse.interactionCandidate

    if (

      target == null
        || target.type == "secondaryControlPoints"
        || Util.targetEqualsSelection(app, target)

    ) { MouseProcessor.clearSelection(app); }

    else MouseProcessor.handleNewSelection(app);

  }


  static translateRig: AppStateProcessor = app => {

    if (app.session.state.mouse.down) {
      let originalOrigin = app.session.state.tacit.draggingRig!;
      let newDisplayOrigin = Vec.add(originalOrigin, Util.mouseDragVector(app))

      app.session = new SessionMutation({ session: app.session, assertion: s => {

        s.settings.display.domain.origin = newDisplayOrigin;

        return s; }, ticketsGetter: _ => [CommonTickets.reloadRig]}).gives();
    }

  }




  static drawSelectionOverlay: AppStateProcessor = (app): void => {

    let i = app.session.state.mouse.activeSelection[0];
    let K = app.FS.controlPoints[i]
    let color = app.session.settings.display.color.palette.colors[i];

    app.display.draftSelectionOverlay(K, color);

    app.display.updateSelectionOverlay();

  }


  static showHoverTarget: TicketProcessor = app => {

    let target = app.session.state.mouse.interactionCandidate;

    if (target !== null) {

      let color = Color.multiply(Util.getTargetColor(app, target), .8);

      app.display.draftHoverCue(target.pos, color, target.type);
      app.display.imageComposer.layers.hoverOverlay.commit()

    }

  }


}

