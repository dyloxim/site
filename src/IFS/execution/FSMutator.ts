import { default as SessionMutation } from "@IFS/execution/sessionMutation";
import { default as Vec } from "@IFS/math/linearAlgebra/vec2"

import { AppStateProcessor } from "@IFS/types/interaction";
import { I_applicationState } from "@IFS/types/state";

import * as Actions from "@IFS/resources/tickets"
import Util from "./util";

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

    let i = app.session.state.mouse.interactionCandidate!.id[0];

    let newPos = Vec.minus(
      app.display.rig.reverseProject(app.session.state.mouse.pos),
      app.session.state.mouse.controlPointOffset!
    )

    app.session = new SessionMutation({ using: app.session, do: s => {

      s.state.mouse.interactionCandidate!.pos = newPos;
      s.settings.FS.transforms[i] = {
        linear:  app.FS.controlPoints[i].basis,
        translation: newPos
      };
      
      return s;

    }, queue: _ => ["RELOAD:FS"]

    }) .eval()

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
      return s;

    }, queue: _ => ["RELOAD:FS"]

    }).eval()

  }


}
