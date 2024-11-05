import { default as SessionMutation } from "@IFS/execution/sessionMutation";
import { default as Vec } from "@IFS/math/linearAlgebra/vec2"

import { AppStateProcessor } from "@IFS/types/interaction";
import { I_applicationState } from "@IFS/types/state";

import Util from "./util";
import IFSAppWorker from "./IFSAppWorker";
import Line from "@IFS/math/geometry/line";
import Lin2x2 from "@IFS/math/linearAlgebra/lin2x2";

export default class FSMutator {

  static mutateFS: AppStateProcessor = (app): void => {

    // sometimes both of these states are triggered erroneously.
    // in this case, disable the other tacit state.
    app.session.state.tacit.draggingRig = null;

    switch(app.session.state.mouse.interactionCandidate!.type) {

      case "primaryControlPoints":

        if (app.session.state.mouse.lastModifiers.meta) {

          FSMutator.duplicateFunction(app);

        } else {

          FSMutator.mutateTranslationComponent(app);

        }

        break;

      case "secondaryControlPoints":

        if (app.session.state.mouse.interactionCandidate!.id[1] == 2) {

          FSMutator.mutateCombinedLinearComponents(app);

        } else {

          FSMutator.mutateLinearComponent(app);

        }

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

  static duplicateFunction: AppStateProcessor = app => {

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

        IFSAppWorker.resetCurrentRandomSeed(s)
        return s;

      }, queue: _ => ["RELOAD:FS"]

      }) .eval()
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


        s.settings.FS.transforms[i] = newTransform;

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


  static mutateCombinedLinearComponents(app: I_applicationState) {

    let i = app.session.state.mouse.interactionCandidate!.id[0];
    let origin = app.FS.controlPoints[i].origin;

    let mousePos = Vec.minus(
      app.display.rig.reverseProject(app.session.state.mouse.pos),
      app.session.state.mouse.controlPointOffset!
    )

    let basis = app.FS.controlPoints[i].basis;



    if (!app.session.state.basisSelected) {
      console.log("beginning mutation");
      app.session.state.basisSelected = basis;
    } else {
      basis = app.session.state.basisSelected;
      if (app.session.state.mouse.lastModifiers.alt) {
        let t0 = Vec.minus(Vec.sum(origin, basis[0], basis[1]), origin);
        let t1 = Vec.minus(mousePos, origin);
        let theta = Math.atan2(t0[0]*t1[1] - t1[0]*t0[1], Vec.dot(t0, t1))
        let rotMat = new Lin2x2(
          [Math.cos(theta), Math.sin(theta)],
          [-Math.sin(theta), Math.cos(theta)
          ]);
        basis = basis.map(v => rotMat.apply(v));
      }
    }


    let newTransforms = app.session.settings.FS.transforms;

    let newBasis = [
      Line.intersection(
        new Line(origin, Vec.normalise(basis[0])),
        new Line(mousePos, Vec.normalise(basis[1]))
      ),
      Line.intersection(
        new Line(origin, Vec.normalise(basis[1])),
        new Line(mousePos, Vec.normalise(basis[0]))
      )
    ].map((a,i) => a == null? basis[i] : a);


    newTransforms[i] = {
      linear: [
        Vec.minus(newBasis[0], origin),
        Vec.minus(newBasis[1], origin)
      ],
      translation: origin
    }


    app.session = new SessionMutation({ using: app.session, do: s => {

      s.state.mouse.interactionCandidate!.pos = mousePos;
      s.settings.FS.transforms = newTransforms;
      IFSAppWorker.resetCurrentRandomSeed(s)
      return s;

    }, queue: _ => ["RELOAD:FS"]

    }).eval()
  }


}
