import { default as FunctionSystem } from "@IFS/functionSystem"
import { default as Rig } from "@IFS/display/rig"
import { default as Color } from "@IFS/display/util/color"
import { default as Util } from "@IFS/execution/util"

import { default as SessionMutation } from "@IFS/execution/sessionMutation"

import { DisplayLayer } from "@IFS/types/specifications";
import { BasicLayerTicket } from "@IFS/types/tickets";
import { AppStateProcessor, TicketProcessor } from "@IFS/types/interaction"

import * as CommonTickets from "@IFS/resources/tickets"
import * as Globals from "@IFS/resources/globalConstants"

export default class IFSAppWorker {

  // Basic Layer Operations

  static processCommonLayerTicket: TicketProcessor = (app, ticket) => {
    (ticket as BasicLayerTicket).consumer.forEach(layer => {
      app.display.imageComposer.layers[(layer as DisplayLayer)].clear()
    });
  }

  // Rig Operations

  static loadRigFromSettings: TicketProcessor = (app, _) => {
    app.display.imageComposer.reconstructAll(app.session.settings.display);
    app.display.rig.reconstruct(
      app.session.settings.display,
      app.display.imageComposer.getPrintArea()
    );
    if (app.session.state.options.bboxes) {
      app.session = new SessionMutation({ session: app.session,
        assertion: s => s,
        ticketsGetter: _ => [CommonTickets.reloadBboxes]
      }).gives();
    }
  }

  // FS Operations

  static revertRigToInitial: TicketProcessor = (app, _) => {
    app.display.config.domain = Rig.handlePossibleImpliedDisplayRegion(
      app.session.settings.FS.referenceRegion,
      app.session.settings.display.domain, true
    );
  }

  static loadFSFromSettings: TicketProcessor = (app, _) => {
    let newFS = new FunctionSystem(app.session.settings.FS);
    app.FS.transforms = newFS.transforms;
    app.FS.weights = newFS.weights;
    app.FS.bboxes.reference = newFS.bboxes.reference;
    app.FS.bboxes.transformed = newFS.bboxes.transformed;
    app.session = new SessionMutation({
      session: app.session,
      assertion: s => {
        s.state.program.thisTurn.choice = 0;
        s.state.program.thisTurn.position = s.settings.FS.firstPoint;
        s.state.program.lastTurn.choice = 0;
        s.state.program.lastTurn.position = s.settings.FS.firstPoint;
        return s;
      },
      ticketsGetter: _ => [
        CommonTickets.generateBasicLayerTicket("erase", ["figure", "pathOverlay"]),
      ]
    }).gives();
  }

  static readFSfromMouseInteraction: TicketProcessor = (app, _) => {}

  static loadBboxesFromSettings: TicketProcessor = (app, _) => {
    // loading bboxes
    app.display.clearBboxesOverlay()
    let bboxLayer = app.display.imageComposer.layers.bboxesOverlay
    // base box
    let baseColor = Color.multiply(app.session.settings.display.color.base, .50);
    let vertSize = Util.getVertRadius(app.session.settings);
    app.display.draftPolygon(bboxLayer, app.FS.bboxes.reference, vertSize, baseColor)
    app.FS.bboxes.transformed.forEach((bbox, i) => {
      let color = app.session.state.options.color ?
        Color.multiply(app.session.settings.display.color.palette.colors[i], .50) : baseColor;
      app.display.draftPolygon(bboxLayer, bbox, vertSize, color)
    })
    app.display.updateBboxesOverlay();
  }

  static movePiece: AppStateProcessor = (app) => {
    // deprecate current position
    let lastTurn = app.session.state.program.thisTurn

    // choose new function and get position of current point under transformation
    let choice = Util.getWeightedRandomChoice(app.FS.weights)
    let newPosition = app.FS.transforms[choice]
      .apply(app.session.state.program.thisTurn.position)

    // update state
    app.session = new SessionMutation({
      session: app.session,
      assertion: (s) => {
        s.state.program.lastTurn = lastTurn;
        s.state.program.thisTurn = { choice: choice, position: newPosition };
        return s;
      },
      ticketsGetter: _ => []
    }).gives();

    // register new point on workpiece
  }

  static maybeMarkLastPath: AppStateProcessor = (app): void => {
    if (app.session.state.options.path
      && !(app.session.state.options.animationRate > Globals.pathDrawThreshold )
    ) {
      app.display.draftLine(
        app.display?.imageComposer.layers.pathOverlay,
        app.session.state.program.thisTurn.position,
        app.session.state.program.lastTurn.position,
        Util.getThisTurnColor(app.session.settings, app.session.state)
      );
    }
  }

  static maybeMarkPoint: AppStateProcessor = (app): void => {
    app.display?.draftPoint(
      app.display.imageComposer.layers.figure,
      app.session.state.program.thisTurn.position,
      Util.getThisTurnColor(app.session.settings, app.session.state)
    );
  }

  static maybeRefreshPathOverlay: AppStateProcessor = (app): void => {
    if (app.session.state.options.path
      && !(app.session.state.options.animationRate > Globals.pathDrawThreshold )
    ) app.display.updatePathOverlay();
  }

  static maybeErasePastPaths: AppStateProcessor = (app): void => {
    if (app.session.state.options.path == "recent"
      && !(app.session.state.options.animationRate > Globals.pathDrawThreshold )
    ) app.display.clearPathOverlay();
  }

  // static maybeEraseFigure = (state: I_state, display: Display): void => {
  //   if (state.interaction.required.redrawFigure) {
  //     display.clearFigure();
  //     state.interaction.required.redrawFigure = false;
  //   }
  // }

  // static maybeErasePath = (state: I_state, display: Display): void => {
  //   if (state.interaction.required.redrawPath) {
  //     display.clearPathOverlay();
  //     state.interaction.required.redrawPath = false;
  //   }
  // }

  // static maybeEraseBboxes = (state: I_state, display: Display): void => {
  //   if (state.interaction.required.redrawBboxes) {
  //     display.clearBboxesOverlay();
  //     state.interaction.required.redrawBboxes = false
  //   }
  // }

  // static maybeEraseSelection = (state: I_state, display: Display): void => {
  //   if (state.interaction.required.redrawSelection) {
  //     display.clearSelectionOverlay();
  //     state.interaction.required.redrawSelection = false;
  //   }
  // }

  // static maybeErasePreviousPaths = (
  //   settings: I_settings,
  //   display: Display
  // ): void => {
  //   // dont draw last path if steps/frame is high
  //   if (Decider.shouldErasePreviousPaths(settings)) {
  //     display?.clearPathOverlay();
  //   }
  // }

  // static maybeDrawBoundingBoxes = (
  //    settings: I_settings,
  //    FS: FunctionSystem,
  //    display: Displaystatic loadFSFromSettings: TicketProcessor
  //    static readFSfromMouseInteraction: TicketProcessor
  //static readFSfromMouseInteraction: TicketProcessor
  //,
  //  ): void => {
  //    if (settings.display.overlays.boundingBoxes) {
  //      // drawing bounding boxes
  //      display.clearBboxesOverlay()
  //      let bboxLayer = display.imageComposer.layers.bboxesOverlay
  //      // base box
  //      let baseColor = Color.multiply(settings.display.color.base, .35);
  //      let vertSize = Util.getVertRadius(settings, display);
  //      display.draftPolygon(bboxLayer, FS.bboxes.reference, vertSize, baseColor)
  //      FS.bboxes.transformed.forEach((bbox, i) => {
  //        let color = settings.display.color.multi ?
  //          Color.multiply(settings.display.color.palette.colors[i], .35) : baseColor;
  //        display.draftPolygon(bboxLayer, bbox, vertSize, color)
  //      })
  //      display.updateBboxesOverlay();
  //    }
  //  }

}
