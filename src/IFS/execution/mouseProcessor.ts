import { AppDerivedStateGetter, AppStateProcessor, TicketProcessor } from "@IFS/types/interaction"
import Util from "./util";
import { default as Vec } from "@IFS/math/linearAlgebra/vec2"
import * as CommonTickets from "@IFS/resources/tickets"
import SessionMutation from "@IFS/execution/sessionMutation";
import Color from "@IFS/display/util/color";

export default class MouseProcessor {

  // entry points

  static handleMoveEvent: AppStateProcessor = app => {
    if (app.session.state.options.bboxes) {
      MouseProcessor.processProximities(app);
      MouseProcessor.processSelectionCandidate(app);
    }
  }

  static handlePressEvent: AppStateProcessor = (app): void => {

    if (app.session.state.mouse.down
      && app.session.state.mouse.selectionCandidate) {

        // get selectionOffset
        let selectionOffset = MouseProcessor.getSelectionOffset(app);

        app.session = new SessionMutation({ session: app.session,
          assertion: s => { s.state.mouse.selectionOffset = selectionOffset; return s; },
          ticketsGetter: s => [CommonTickets.setSwitch_MutatingFS]
        }).gives();
        
      } else if (!app.session.state.mouse.down) {

        app.session = new SessionMutation({ session: app.session,
          assertion: s => { s.state.mouse.selectionOffset = null; return s; },
          ticketsGetter: _ => [CommonTickets.unsetSwitch_MutatingFS]
        }).gives();

      }
  }

  // subroutines

  private static processProximities: AppStateProcessor = app => {

    let proximityArray: boolean[][] = MouseProcessor
      .getProximityArray(app)

    if (proximityArray !== app.session.state.mouse.proximities) {
      // update session with proximity array
      app.session = new SessionMutation({ session: app.session,
        assertion: s => { s.state.mouse.proximities = proximityArray; return s },
        ticketsGetter: _ => []
      }).gives()
    }

    }

  static processSelectionCandidate: TicketProcessor = app => {

    let candidate: null | number[] = null;
    app.session.state.mouse.proximities!.forEach((T, i) => T.forEach((vertIsProximal, j) => {
      if (vertIsProximal && candidate == null) candidate = [i,j]
    }));

    if(app.session.state.mouse.selectionCandidate != candidate) {
      app.session = new SessionMutation({ session: app.session,
        assertion: s => { s.state.mouse.selectionCandidate = candidate; return s; },
        ticketsGetter: s => {
          if (s.state.mouse.selectionCandidate) {
            return [CommonTickets.highlightSelection]
          } else {
            return [CommonTickets.generateBasicLayerTicket("erase", ["selectionOverlay"])]
          }
        }
      }).gives();
    }

    app.display.imageComposer.layers.selectionOverlay.commit()
  }

  // Common Ticket Processors

  static highlightSelection: TicketProcessor = app => {
    app.display.imageComposer.layers.selectionOverlay.clear()
    let i = app.session.state.mouse.selectionCandidate![0]
    let layer = app.display.imageComposer.layers.selectionOverlay;
    let bbox = app.FS.bboxes.transformed[i];
    let color = Color.multiply(app.session.settings.display.color.base, .6);
    // highlight bounding box basis vectors;
    app.display.draftLine(layer, bbox[0], bbox[1], color);
    app.display.draftLine(layer, bbox[0], bbox[3], color);
    // mark verticies
    let vertSize = Util.getVertRadius(app.session.settings);
    let selectionRadius = Util.getSelectionRadius(app.session.settings);
    app.display.draftCircle(layer, bbox[0], vertSize, true, color);
    app.display.draftCircle(layer, bbox[1], vertSize, true, color);
    app.display.draftCircle(layer, bbox[3], vertSize, true, color);
    // mark selection candidate
    app.display.draftCircle(
      layer,
      bbox[app.session.state.mouse.selectionCandidate![1]],
      selectionRadius * 0.75,
      false,
      Color.multiply(app.session.settings.display.color.base, .7)
    );
    app.display.draftCircle(
      layer,
      bbox[app.session.state.mouse.selectionCandidate![1]],
      selectionRadius * 0.65,
      false,
      Color.multiply(app.session.settings.display.color.palette.colors[i], .7)
    );
    if (app.session.state.mouse.selectionCandidate![1] == 2) {
      app.display.draftCircle(
        layer,
        bbox[app.session.state.mouse.selectionCandidate![1]],
        vertSize * .5, true,
        (() => {
          if (app.session.state.options.color) {
            return Color.multiply(app.session.settings.display.color.palette.colors[i], .70)
          } else {
            return Color.multiply(app.session.settings.display.color.base, .70)
          }
        })()
      );
    }
    app.display.imageComposer.layers.selectionOverlay.commit()
  }

  static setFSMutationSwitch: TicketProcessor = (app) => {
    app.session = new SessionMutation({
      session: app.session,
      assertion: s => { s.state.tacit.mutatingFS = true; return s; },
      ticketsGetter: _ => []
    }).gives();
  }

  static unsetFSMutationSwitch: TicketProcessor = (app) => {
    app.session = new SessionMutation({
      session: app.session,
      assertion: s => { s.state.tacit.mutatingFS = false; return s; },
      ticketsGetter: _ => []
    }).gives();
  }



  // Derived state getters (helper functions)

  private static getProximityArray: AppDerivedStateGetter = (app): boolean[][] | null => {
    if (app.session.state.tacit.mutatingFS) {

      return app.session.state.mouse.proximities;

    } else {

      return app.FS.bboxes.transformed.map((bbox) => bbox.map((vert) => {
        let proximity = Vec.dist(app.display.rig.projectPoint(vert), app.session.state.mouse.pos);
        let isProximal = (proximity < Util.getSelectionPixelRadius(app));
        return isProximal;

      }));
    }
  }

  private static getSelectionOffset: AppDerivedStateGetter = (app): number[] | null => {
    if (app.session.state.mouse.selectionCandidate) {
      let [i,j] = app.session.state.mouse.selectionCandidate!;
      return Vec.minus(
        app.FS.bboxes.transformed[i][j],
        app.display.rig.reverseProject(app.session.state.mouse.pos)
      )
    } else {
      return null;
    }
  }

}
