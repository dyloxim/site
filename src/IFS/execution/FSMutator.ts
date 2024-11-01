import { default as SessionMutation } from "@IFS/execution/sessionMutation";
import { default as Vec } from "@IFS/math/linearAlgebra/vec2"

import { AppStateProcessor } from "@IFS/types/interaction";
import { I_applicationState } from "@IFS/types/state";

import * as Actions from "@IFS/resources/tickets"
import Util from "./util";
import IFSAppWorker from "./IFSAppWorker";

export default class FSMutator {



  static mutateFS: AppStateProcessor = (app): void => {

    switch(app.session.state.mouse.interactionCandidate!.type) {

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

      app.session = new SessionMutation({ using: app.session, do: s => {

        s.state.selectableEntities.secondaryControlPoints = newEntities;
        return s;

      }, queue: _ => [["ERASE", ["selectionOverlay"]], "DO:drawSelectionOverlay"]

      }).eval();

    }
  }


  static mutateTranslationComponent: AppStateProcessor = app => {

    if (!app.session.state.tacit.pendingFSUpdate) {

      let i = app.session.state.mouse.interactionCandidate!.id[0];

      let newPos = Vec.minus(
        app.display.rig.reverseProject(app.session.state.mouse.pos),
        app.session.state.mouse.controlPointOffset!
      )

      app.session = new SessionMutation({ using: app.session, do: s => {

        s.state.mouse.interactionCandidate!.pos = newPos;
        let newTransform = {
          linear:  [...app.FS.controlPoints[i].basis],
          translation: newPos
        };

        // duplicate current function
        if (s.state.mouse.lastModifiers.meta) {

          let newId = s.settings.FS.transforms.length;
          let n = s.settings.FS.weights.length - 1;

          s.state.mouse.interactionCandidate = {
            id: [newId, 0],
            type: "primaryControlPoints",
            pos: s.state.mouse.pos,
            isProximal: true,
          }

          s.settings.FS.transforms = [...s.settings.FS.transforms, newTransform];
          s.settings.FS.weights = s.settings.FS.weights == "uniform" ? "uniform"
            : [...s.settings.FS.weights.map(a => n-1*a/n), 1/n];
          s.state.mouse.lastModifiers.meta = false;
          s.state.tacit.pendingFSUpdate = true;
          s.state.selected = [newId];

        } else {

          s.settings.FS.transforms[i] = newTransform;

        }

        IFSAppWorker.resetCurrentRandomSeed(s)
        return s;

      }, queue: _ => ["RELOAD:FS"]

      }) .eval()
    }

  }




  
  static mutateLinearComponent(app: I_applicationState) {

    let [i, j] = app.session.state.mouse.interactionCandidate!.id;

    let newPos = Vec.minus(
      app.display.rig.reverseProject(app.session.state.mouse.pos),
      app.session.state.mouse.controlPointOffset!
    )

    let newLinear = app.FS.controlPoints[i].basis;
    newLinear[j] = Vec.minus(newPos, app.FS.controlPoints[i].origin);

    let newTransforms = app.session.settings.FS.transforms;

    newTransforms[i] = {
      linear: newLinear,
      translation: app.FS.controlPoints[i].origin
    } 

    app.session = new SessionMutation({ using: app.session, do: s => {

      s.state.mouse.interactionCandidate!.pos = newPos;
      s.settings.FS.transforms = newTransforms;
      IFSAppWorker.resetCurrentRandomSeed(s)
      return s;

    }, queue: _ => ["RELOAD:FS"]

    }).eval()

  }


}
