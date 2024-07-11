import { AppDerivedStateGetter, AppStateProcessor } from "@IFS/types/interaction"
import Util from "./util";
import { default as Vec } from "@IFS/math/linearAlgebra/vec2"
import * as CommonTickets from "@IFS/resources/tickets"
import SessionMutation from "@IFS/execution/sessionMutation";
import Color from "@IFS/display/util/color";
import * as Colors from "@IFS/resources/colors";
import { I_applicationState } from "..";

export default class MouseProcessor {

  static maybeUpdateProximityArray: AppDerivedStateGetter = (app): boolean[][] | null => {
    if (!app.session.state.tacit.mutatingFS) {
      return MouseProcessor.getProximityArray(app);
    } else {
      return app.session.state.mouse.proximities;
    }
    
  }

  static handleMoveEvent: AppStateProcessor = (app): void => {

    let proximityArray: boolean[][] = MouseProcessor
      .maybeUpdateProximityArray(app)

    if (
      proximityArray !== app.session.state.mouse.proximities
        && app.session.state.options.bboxes
    ) {

      // update session with proximity array
      app.session = new SessionMutation({
        session: app.session,
        assertion: s => { s.state.mouse.proximities = proximityArray; return s },
        ticketsGetter: _ => []
      }).gives()

      // search for selection candidate
      let candidate: null | number[] = null;

      app.display.clearSelectionOverlay();
      proximityArray.forEach((T, i) => T.forEach((vertIsProximal, j) => {
          if (vertIsProximal && candidate == null) candidate = [i,j]
      }));

      // update session with selection candidate if new
      if(app.session.state.mouse.selectionCandidate != candidate) {
        // 
        app.session = new SessionMutation({
          session: app.session,
          assertion: s => {
            s.state.mouse.selectionCandidate = candidate;
            return s;
          },
          ticketsGetter: s => {
            if (s.state.mouse.selectionCandidate) {
              return [CommonTickets.highlightSelection]
            } else {
              return [CommonTickets.generateBasicLayerTicket(
                "layerErase", "selectionOverlay", "erase section overlay"
              )]
            }
          }
        }).gives();
      }

      app.display.imageComposer.layers.selectionOverlay.commit()
    }
  }

  static getProximityArray: AppDerivedStateGetter = (app): boolean[][] => {

    let selectionPixelRadius = Util.getSelectionPixelRadius(app)

    return app.FS.bboxes.transformed.map((bbox) => bbox.map((vert) => {

      let proximity = Vec.dist(
        app.display.rig.projectPoint(vert),
        app.session.state.mouse.pos
      );
      let isProximal = (proximity < selectionPixelRadius); return isProximal;

  }));
  }

  static getSelectionOffset: AppDerivedStateGetter = (app): number[] | null => {
    if (app.session.state.mouse.selectionCandidate) {
      let [i,j] = app.session.state.mouse.selectionCandidate!;
      return Vec.minus(
        app.display.rig.reverseProject(app.session.state.mouse.pos),
        app.FS.bboxes.transformed[i][j]
      )
    } else {
      return null;
    }
  }

  static highlightSelection: AppStateProcessor = (app): void => {
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

  static handlePressEvent: AppStateProcessor = (app): void => {
    if (app.session.state.mouse.down
      && app.session.state.mouse.selectionCandidate) {
        // set selectionOffset
        let selectionOffset = MouseProcessor.getSelectionOffset(app);
        app.session = new SessionMutation({
          session: app.session,
          assertion: s => {
            s.state.tacit.mutatingFS = true;
            s.state.mouse.selectionOffset = selectionOffset;
            return s;
          },
          ticketsGetter: s => {
            if (s.state.mouse.selectionCandidate) {
              return [CommonTickets.highlightSelection]
            } else {
              return [CommonTickets.generateBasicLayerTicket(
                "layerErase", "selectionOverlay", "erase"
              )]
            }
          }
        }).gives();
        
      } else if (!app.session.state.mouse.down) {

        app.session = new SessionMutation({
          session: app.session,
          assertion: s => {
            s.state.mouse.selectionOffset = null;
            s.state.tacit.mutatingFS = false;
            return s; },
          ticketsGetter: _ => []
        }).gives();

      }
  }

}
