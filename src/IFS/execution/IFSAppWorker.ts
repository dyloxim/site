import { default as FunctionSystem } from "@IFS/functionSystem"
import { default as Rig } from "@IFS/display/rig"
import { default as Color } from "@IFS/display/util/color"
import { default as Util } from "@IFS/execution/util"

import { default as Vec } from "@IFS/math/linearAlgebra/vec2"

import { default as SessionMutation } from "@IFS/execution/sessionMutation"

import { DisplayLayer } from "@IFS/types/specifications";
import { BasicLayerTicket } from "@IFS/types/tickets";

import * as CommonTickets from "@IFS/resources/tickets"
import * as Globals from "@IFS/resources/globalConstants"

import { AppStateProcessor, I_selectableEntityMetaData, TicketProcessor } from "@IFS/types/interaction"
import { I_affine } from "@IFS/types/mathematical"

export default class IFSAppWorker {

  // ordinary routines

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

  // TICKETS

  // basic layer operations

  static processCommonLayerTicket: TicketProcessor = (app, ticket) => {
    (ticket as BasicLayerTicket).consumer.forEach(layer => {
      app.display.imageComposer.layers[(layer as DisplayLayer)].clear()
    });
  }

  // reloading from settings

  static loadRigFromSettings: TicketProcessor = (app, _) => {
    app.display.imageComposer.reconstructAll(app.session.settings.display);
    app.display.rig.reconstruct(
      app.session.settings.display,
      app.display.imageComposer.getPrintArea()
    );
    app.session = new SessionMutation({ session: app.session,
      assertion: s => s,
      ticketsGetter: _ => [CommonTickets.reviewControlPointsConfig]
    }).gives();
  }

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
    app.FS.controlPoints = newFS.controlPoints
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

  static drawAxis: TicketProcessor = app => {
    app.display.clearGrid()
    let layer = app.display.imageComposer.layers.grid
    let axisColor = Color.multiply(app.session.settings.display.color.base, .3);
    let domain = app.display.rig.domain
    app.display.draftLine(layer, [domain.centre[0]-domain.width/2, 0], [domain.centre[0]+domain.width/2, 0], axisColor)
    app.display.draftLine(layer, [0,domain.centre[1]-domain.height/2], [0, domain.centre[1]+domain.height/2], axisColor)

  }

  static loadControlPointsFromSettings: TicketProcessor = app => {

    app.session = new SessionMutation({ session: app.session, assertion: s => {

      let points: I_selectableEntityMetaData[] = app.FS.controlPoints
        .map((K, i) => {

          return {
            id: [i,0],
            type: "primaryControlPoints",
            pos: K.origin,
            isProximal: false
          }

        });

        s.state.selectableEntities.primaryControlPoints = points
        return s;

      },
      ticketsGetter: _ => []
    }).gives();

    app.FS.controlPoints.map(K => K.origin).forEach((p, i) => {
      let color = app.session.settings.display.color.palette.colors[i]
      app.display.draftPrimaryControlPoint(p, color, false);
    })

    app.display.updateControlPointsOverlay();

  }

  static reviewControlPointsConfig: TicketProcessor = app => {
    if (app.session.state.options.controlPointsShown) {
      app.session = new SessionMutation({session: app.session, assertion: s => s,

        ticketsGetter: s => {

          if (
            s.state.mouse.activeSelection.length == 1
          ) {

            return [
              CommonTickets.reloadSelectionOverlay,
              CommonTickets.reloadControlPoints
            ]

          } else return [CommonTickets.reloadControlPoints]
        }

      }).gives();
    }
  }

  static normaliseControlPoints: TicketProcessor = app => {
    let points = app.session.settings.FS.transforms.map((T) => {
      return (T as I_affine).translation ?? [0,0];
    });
    let middlePoint = Vec.scale(
      Vec.sum(...points),
      1/points.length
    )
    let newTransforms = app.session.settings.FS.transforms.map(T => {
      let newTranslation = Vec.minus((T as I_affine).translation ?? [0,0], middlePoint);
      return {
        linear: (T as I_affine).linear,
        translation: newTranslation
      };
    });
    app.session = new SessionMutation({ session: app.session,
      assertion: s => {s.settings.FS.transforms = newTransforms; return s },
      ticketsGetter: _ => [CommonTickets.reloadRig, CommonTickets.reloadFS]
    }).gives()
  }

}