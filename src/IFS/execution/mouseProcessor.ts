import { AppStateProcessor, I_selectableEntityMetaData, SelectableEntityCategory, TicketProcessor } from "@IFS/types/interaction"

import { default as FSMutator } from "@IFS/execution/FSMutator";
import { default as SessionMutation } from "@IFS/execution/sessionMutation";

import { default as Color } from "@IFS/display/util/color";
import { default as Vec } from "@IFS/math/linearAlgebra/vec2"
import { default as Util } from "@IFS/execution/util";

import * as Actions from "@IFS/resources/tickets"
import { QueueItem } from "@IFS/types/tickets";

export default class MouseProcessor {


  // state monitoring
  // ----------------


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


  // event response handling
  // -----------------------


  
  // base events


  static handleMoveEvent: AppStateProcessor = app => {

    if (app.session.state.options.controlPointsShown) {

      if (app.session.state.tacit.mutatingFS) FSMutator.mutateFS(app);

      if (!app.session.state.mouse.down) MouseProcessor.processProximities(app);

    }

    if (app.session.state.tacit.draggingRig) MouseProcessor.translateRig(app);

  }


  static handleMouseDownEvent: AppStateProcessor = app => {

    app.session = new SessionMutation({ using: app.session, do: s => {

      s.state.mouse.actionUndecided = Date.now();
      s.state.mouse.controlPointOffset = Util.getControlPointOffset(app)

      if (s.state.mouse.controlPointOffset != null) {
        s.state.mouse.interactionPrimed = true;
      }

      return s;

    }}).result();

  }


  static handleClickEvent: AppStateProcessor = app => {

    let target = app.session.state.mouse.interactionCandidate;

    if (target == null) {

      MouseProcessor.handleBGClickEvent(app);

    } else MouseProcessor.activateSelection(app);

  }

  static handleBGClickEvent: AppStateProcessor = app => {

    console.log("bg clicked");

    if (app.session.state.selected.length > 0) {

      MouseProcessor.clearSelection(app);

    }

    else app.session = new SessionMutation({ using: app.session, do: s => {

      s.state.options.controlPointsShown = !s.state.options.controlPointsShown;
      return s;

    }, queue: _ => [

      "REVIEW:controlPoints",
      ["ERASE", ["controlPointsOverlay", "hoverOverlay", "selectionOverlay"]]
      
    ]}).result();

  }

  static beginDragInteraction: AppStateProcessor = app => {

    if (app.session.state.mouse.interactionPrimed) {

      app.session = new SessionMutation({ using: app.session, do: s => {

        s.state.tacit.mutatingFS = true;
        s.state.selected = [s.state.mouse.interactionCandidate!.id[0]]
        return s;

      }, queue: _ => [

        "REVIEW:controlPoints",
        ["ERASE", ["hoverOverlay"]]

      ]}).result();


    } else {

      app.session = new SessionMutation({ using: app.session, do: s => {

        let initialDragPos = app.session.settings.display.domain.origin;
        s.state.tacit.draggingRig = initialDragPos;

        return s;}, queue: _ => []}).result();

    }
  }



  

  // actions
  // -------


  static processProximities: AppStateProcessor = app => {

    let oldTarget = app.session.state.mouse.interactionCandidate;
    let newTarget = Util.getCurrentTarget(app);

    if (!Util.entitiesEqual(oldTarget, newTarget)) {
      
      app.session = new SessionMutation({ using: app.session, do: s => {

        s.state.mouse.interactionCandidate = newTarget;
        return s;

      }, queue: _ =>  {

        /*
         *  Possible situations requiring action:
         *
         *  1. Target changed from selected nothing to selected something
         *
         *      Response: highlight new target
         *     
         *  2. Target changed from selected one thing to selected nothing
         *
         *      Response: erase / clear hover overlay
         *
         *  3. Target changed from selected one thing to selected another thing
         *
         *      Response: erase / clear hover overlay and highlight new target
         *
         */

        let queue: QueueItem[] = []; if (oldTarget == null) queue = [

          "DO:showHoverTarget"

        ]; else if (newTarget == null) queue = [

          ["ERASE", ["hoverOverlay"]]

        ]; else queue = [

          "DO:showHoverTarget",
          ["ERASE", ["hoverOverlay"]]

        ]; return queue;


      }}).result()

    }

  }


  static handleSecondaryControlPointClicked: AppStateProcessor = _ => {}


  static activateSelection: AppStateProcessor = app => {

    app.session = new SessionMutation({ using: app.session, do: s => {

      let i = app.session.state.mouse.interactionCandidate!.id[0];
      s.state.selected = [i];
      return s;

    }, queue: _ => ["RELOAD:secondaryEntities"]

    }).result();

  }


  static clearSelection: AppStateProcessor = app => {

    app.session = new SessionMutation({ using: app.session, do: s => {

      s.state.selected = [];
      s.state.selectableEntities["secondaryControlPoints"] = [];

      return s;

    }, queue: _ => [["ERASE", ["selectionOverlay", "hoverOverlay"]],

    ]}).result();

  }


  static translateRig: AppStateProcessor = app => {

    if (app.session.state.mouse.down) {
      let originalOrigin = app.session.state.tacit.draggingRig!;
      let newDisplayOrigin = Vec.add(originalOrigin, Util.mouseDragVector(app))

      app.session = new SessionMutation({ using: app.session, do: s => {

        s.settings.display.domain.origin = newDisplayOrigin;
        return s;

      }, queue: _ => ["RELOAD:rig"]

      }).result();
    }

  }


  static drawSelectionOverlay: AppStateProcessor = (app): void => {

    let i = app.session.state.selected[0];
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

