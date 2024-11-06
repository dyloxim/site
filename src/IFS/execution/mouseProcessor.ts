import { AppStateProcessor, I_selectableEntityMetaData, SelectableEntityCategory, TicketProcessor } from "@IFS/types/interaction"

import { default as FSMutator } from "@IFS/execution/FSMutator";
import { default as SessionMutation } from "@IFS/execution/sessionMutation";

import { default as Color } from "@IFS/display/util/color";
import { default as Vec } from "@IFS/math/linearAlgebra/vec2"
import { default as Util } from "@IFS/execution/util";
import * as Colors from "@IFS/resources/colors"

import { QueueItem } from "@IFS/types/tickets";

export default class MouseProcessor {


  // state monitoring
  // ----------------


  static maybeDecideMouseAction: AppStateProcessor = app => {

    if (Util.interactionDecisionTimedOut(app)) {

      app.session.state.mouse.actionUndecided = null;

      if (app.session.state.mouse.down) {

        if (app.session.state.mouse.interactionPrimed) MouseProcessor.beginFSMutation(app);

      } else {

        MouseProcessor.handleClickEvent(app);

      }

    }

  }


  // event response handling
  // -----------------------


  
  // base events


  static handleMoveEvent: AppStateProcessor = app => {

    let layer = app.display.imageComposer.layers.mouseSpotlightOverlay;
    layer.clear()

    if (!app.session.state.mouse.interactionCandidate && !app.session.settings.display.tacit.isMobile) {

      let vertSize = 1.8 * Util.getVertRadius(app.session.settings.display);
      let grey = new Color(15, 15, 15, 100)
      let pos = app.display.rig.reverseProject(app.session.state.mouse.pos);

      app.display.draftCircle(layer, pos, vertSize, true, grey)
      layer.commit()
    }

    if (app.session.state.options.controlPointsShown) {

      if (app.session.state.tacit.mutatingFS) FSMutator.mutateFS(app);

      if (!app.session.state.mouse.down) MouseProcessor.processProximities(app);

    }

    if (app.session.state.tacit.draggingRig) MouseProcessor.translateRig(app);

  }


  static handleMouseDownEvent: AppStateProcessor = app => {

    if (app.session.settings.display.tacit.isMobile) MouseProcessor.processProximities(app);

    app.session = new SessionMutation({ using: app.session, do: s => {

      s.state.mouse.actionUndecided = Date.now();
      s.state.mouse.controlPointOffset = Util.getControlPointOffset(app)
      if (app.session.state.mouse.controlPointOffset != null) {
        s.state.mouse.interactionPrimed = true;
        s.state.options.controlPointsShown = true;
      }

      return s;

    }}).eval();


    if (app.session.state.mouse.controlPointOffset == null) {
      MouseProcessor.beginRigDragInteraction(app);
    }

  }


  static handleOutEvent: AppStateProcessor = app => {
    let layer = app.display.imageComposer.layers.mouseSpotlightOverlay;
    layer.clear()
  }


  static handleClickEvent: AppStateProcessor = app => {

    let target = app.session.state.mouse.interactionCandidate;

    if (target == null) {

      MouseProcessor.handleBGClickEvent(app);

    } else MouseProcessor.activateSelection(app);

  }


  static handleBGClickEvent: AppStateProcessor = app => {

    if (app.session.state.selected.length > 0) {

      MouseProcessor.clearSelection(app);

    }

    else app.session = new SessionMutation({ using: app.session, do: s => {

      s.state.options.controlPointsShown = !s.state.options.controlPointsShown;
      return s;

    }, queue: _ => [

      "REVIEW:controlPoints",
      ["ERASE", ["controlPointsOverlay", "hoverOverlay", "selectionOverlay"]]
      
    ]}).eval();

  }


  static beginRigDragInteraction: AppStateProcessor = app => {

    app.session = new SessionMutation({ using: app.session, do: s => {

      let initialDragPos = app.session.settings.display.domain.origin;
      s.state.tacit.draggingRig = initialDragPos;

      return s;

    }}).eval();

  }

  
  static beginFSMutation: AppStateProcessor = app => {

    if (app.session.state.mouse.interactionCandidate) {

      app.session = new SessionMutation({ using: app.session, do: s => {

        s.state.tacit.mutatingFS = true;
        s.state.selected = [s.state.mouse.interactionCandidate!.id[0]]
        return s;

      }, queue: _ => [

        "REVIEW:controlPoints",
        ["ERASE", ["hoverOverlay"]]

      ]}).eval();

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


      }}).eval()

    }

  }


  static handleSecondaryControlPointClicked: AppStateProcessor = _ => {}


  static activateSelection: AppStateProcessor = app => {

    let i = app.session.state.mouse.interactionCandidate!.id[0];

    app.session = new SessionMutation({ using: app.session, do: s => {

      if (s.state.selected[0] != i) {
        s.state.selected = [i];
      } else {
        s.state.selected = [];
        s.state.selectableEntities.secondaryControlPoints = [];
      }
      return s;

    }, queue: s => s.state.selected[0] != i ? [
      "RELOAD:controlPoints", "RELOAD:secondaryEntities"
    ] : [
      s.state.mouse.interactionCandidate?.type == "primaryControlPoints" ? [
        "ERASE", ["selectionOverlay"]
      ] : [
        "ERASE", ["selectionOverlay", "hoverOverlay"]
      ]
      
    ]

    }).eval();

  }


  static clearSelection: AppStateProcessor = app => {

    app.session = new SessionMutation({ using: app.session, do: s => {

      s.state.selected = [];
      s.state.selectableEntities["secondaryControlPoints"] = [];

      return s;

    }, queue: _ => [["ERASE", ["selectionOverlay", "hoverOverlay"]],

    ]}).eval();

  }


  static translateRig: AppStateProcessor = app => {

    if (app.session.state.mouse.down) {
      let originalOrigin = app.session.state.tacit.draggingRig!;
      let newDisplayOrigin = Vec.add(originalOrigin, Util.mouseDragVector(app))

      app.session = new SessionMutation({ using: app.session, do: s => {

        s.settings.display.domain.origin = newDisplayOrigin;
        return s;

      }, queue: _ => ["RELOAD:rig"]

      }).eval();
    }

  }


  static drawSelectionOverlay: AppStateProcessor = (app): void => {

    let i = app.session.state.selected[0];
    let K = app.FS.controlPoints[i]
    let color = Util.getColor(app.session.settings, i);

    app.display.draftSelectionOverlay(K, color);

    app.display.updateSelectionOverlay();

  }


  static showHoverTarget: TicketProcessor = app => {

    let target = app.session.state.mouse.interactionCandidate;

    if (target !== null) {

      let color: Color;
      if (target.type == "primaryControlPoints") {
        color = Color.multiply(Util.getTargetColor(app, target), .8);
      } else {
        color = target.id[1] == 0 ? Colors.Red : Colors.Green;
      }
      

      app.display.draftHoverCue(target.pos, color, target.type);
      app.display.imageComposer.layers.hoverOverlay.commit()

    }

  }


}

