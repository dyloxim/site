import { default as FunctionSystem } from "@IFS/functionSystem"
import { default as Rig } from "@IFS/display/rig"
import { default as Color } from "@IFS/display/util/color"
import { default as Vec } from "@IFS/math/linearAlgebra/vec2"

import { DisplayLayer } from "@IFS/types/specifications";
import { BasicLayerTicket, ActionKey } from "@IFS/types/tickets";
import { AppStateProcessor, I_selectableEntityMetaData, TicketProcessor } from "@IFS/types/interaction"
import { I_affine } from "@IFS/types/mathematical"


import { default as Util } from "@IFS/execution/util"
import { default as SessionMutation } from "@IFS/execution/sessionMutation"
import { I_applicationState } from "@IFS/types/state";
import { DefinedDisplayLayers } from '@IFS/resources/globalConstants';



export default class IFSAppWorker {

  static ensureDisplayAttached = (app: I_applicationState) => {
    if (!app.display.imageComposer.layers.figure.material.parentElement) {

      console.log("BAD!");
      document.querySelectorAll(".canvas").forEach(el => el.remove());
      let container = document.getElementById("displayContainer")!;

      DefinedDisplayLayers.forEach(layerKey => {
        let layer = app.display.imageComposer.layers[layerKey]
        container.appendChild(layer.material!);
      })
      app.display.imageComposer.layers.pathOverlay.clear();
      app.session.state.tacit.pendingRerender = false;
    }
  }



  
  static movePiece: AppStateProcessor = (app) => {

    // deprecate current position
    let lastTurn = app.session.state.program.thisTurn

    // choose new function and get position of current point under transformation
    let choice = Util.getWeightedRandomChoice(app.FS.weights)
    let newPosition = app.FS.transforms[choice]
      .apply(app.session.state.program.thisTurn.position)

    app.session = new SessionMutation({ using: app.session, do: s => {

        s.state.program.lastTurn = lastTurn;
        s.state.program.thisTurn = { choice: choice, position: newPosition };
        return s;

    }}).eval();

  }

  static maybeMarkLastPath: AppStateProcessor = (app): void => {
    if (app.session.state.options.path !== "None") {
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
    if (app.session.state.options.path !== "None")
      app.display.updatePathOverlay();
  }

  static maybeErasePastPaths: AppStateProcessor = (app): void => {
    if (app.session.state.options.path == "Fleeting")
      app.display.clearPathOverlay();
  }




  
  // TICKETS
  
  // basic layer operations

  static processLayerTicket: TicketProcessor = (app, ticket) => {
    (ticket as BasicLayerTicket).consumer.forEach(layer => {
      app.display.imageComposer.layers[(layer as DisplayLayer)].clear()
    });
  }



  
  // reloading from settings

  static reconstructRig: TicketProcessor = app => {

    app.display.imageComposer.reconstructAll(app.session.settings.display);
    IFSAppWorker.loadRigFromSettings(app);

  }

  static loadRigFromSettings: TicketProcessor = app => {

    app.display.rig.reload(
      app.session.settings.display,
      app.display.imageComposer.getPrintArea()
    );

    app.session = new SessionMutation({ using: app.session,

      queue: _ => [
        "REVIEW:controlPoints",
        "RELOAD:FS"
      ]

    }).eval();

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
    app.session = new SessionMutation({ using: app.session, do: s => {

        s.state.program.thisTurn.choice = 0;
        s.state.program.thisTurn.position = s.settings.FS.firstPoint;
        s.state.program.lastTurn.choice = 0;
        s.state.program.lastTurn.position = s.settings.FS.firstPoint;
        return s;

      },

      queue: _ => [

        "REVIEW:controlPoints", "RELOAD:secondaryEntities",
        ["ERASE",
          ["figure", "pathOverlay", "controlPointsOverlay", "selectionOverlay", "hoverOverlay"]
        ]

      ]}).eval();
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

    app.session = new SessionMutation({ using: app.session, do: s => {

      let points: I_selectableEntityMetaData[] = app.FS.controlPoints.map((K, i) => {

          return {
            id: [i,0],
            type: "primaryControlPoints",
            pos: K.origin,
            isProximal: false
          }

        });

        s.state.selectableEntities.primaryControlPoints = points
        return s;

      }}).eval();

    app.FS.controlPoints.map(K => K.origin).forEach((p, i) => {
      let color = app.session.settings.display.color.palette.colors[i]
      app.display.draftPrimaryControlPoint(p, color, false);
    })

    app.display.updateControlPointsOverlay();

  }

  static reviewControlPointsConfig: TicketProcessor = app => {

    if (app.session.state.options.controlPointsShown) {

      app.session = new SessionMutation({ using: app.session,

        queue: s => {

          let actions: ActionKey[] = ["RELOAD:controlPoints"]

          if (s.state.selected.length == 1) actions = [...actions, "RELOAD:selectionOverlay"]

          return actions;

        }}).eval();
    }
  }

  static normaliseControlPoints: TicketProcessor = app => {

    // prepare new values

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


    // update session

    app.session = new SessionMutation({ using: app.session, do: s => {

      s.settings.FS.transforms = newTransforms;
      return s

    }, queue: _ => ["RELOAD:rig", "RELOAD:FS"]

    }).eval()

  }

}
