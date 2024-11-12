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

        if (app.session.state.mouse.lastModifiers.meta
          && !app.session.state.tacit.duplicateSelected) {

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

    if (!app.session.state.tacit.pendingFSUpdate
      && app.session.state.mouse.interactionCandidate) {

        app.session.state.tacit.duplicateSelected = true;
        let i = app.session.state.mouse.interactionCandidate.id[0];

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

    if (!app.session.state.tacit.pendingFSUpdate
      && app.session.state.mouse.interactionCandidate) {

        let i = app.session.state.mouse.interactionCandidate.id[0];
        let basis = app.FS.controlPoints[i].basis;
        let origin = app.FS.controlPoints[i].origin;
        let newPos = Vec.minus(
          app.display.rig.reverseProject(app.session.state.mouse.pos),
          app.session.state.mouse.controlPointOffset!
        )


        if (!app.session.state.workingFS) {

          // when initiating transform or when modifier has changed, 
          // store value of basis at that instance for future reference.
          app.session.state.workingFS = [origin, basis];

        } else {

          origin = app.session.state.workingFS[0];

          if (app.session.state.mouse.lastModifiers.alt) {

            // Action when alt held down

            // effect: constrain to vertical / horizontal / diagonal movement
            let possiblePositions = [
              Line.intersection(new Line(origin, [1,0]), new Line(newPos, [0,1])),
              Line.intersection(new Line(origin, [0,1]), new Line(newPos, [1,0])),
              Line.intersection(new Line(origin, [1,1]), new Line(newPos, [-1,1])),
              Line.intersection(new Line(origin, [-1,1]), new Line(newPos, [1,1])),
            ] .map(v => v? v : newPos); // handle null case

            let closest = possiblePositions[0]

            possiblePositions.forEach(v => {
              if (Vec.mod(Vec.minus(origin, v)) > Vec.mod(Vec.minus(origin, closest))) {
                closest = v;
              }
            });

            newPos = closest;

          }
        }


        if (app.session.state.mouse.lastModifiers.ctrl) {

          // Action when ctrl held down

          // effect: constrain coordinate values to grid, i.e. multiples
          // of 0.1
          newPos = newPos.map(a => Math.round(a * 10) / 10);

        }


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

    if (app.session.state.mouse.interactionCandidate) {

      let [i, j] = app.session.state.mouse.interactionCandidate!.id;

      let newPos = Vec.minus(
        app.display.rig.reverseProject(app.session.state.mouse.pos),
        app.session.state.mouse.controlPointOffset!
      )

      if (app.session.state.mouse.lastModifiers.ctrl) {

        // Action when ctrl held down

        // effect: constrain coordinate values to grid, i.e. multiples
        // of 0.1
        newPos = newPos.map(a => Math.round(a * 10) / 10);

      }

      let basis = app.FS.controlPoints[i].basis;
      let origin = app.FS.controlPoints[i].origin;
      let t = Vec.minus(newPos, app.FS.controlPoints[i].origin);

      if (!app.session.state.workingFS
        || app.session.state.mouse.pendingModifierUpdate
      ) {

        // when initiating transform or when modifier has changed, 
        // store value of basis at that instance for future reference.
        app.session.state.workingFS = [origin, basis];
        app.session.state.mouse.pendingModifierUpdate = false;

      } else {

        basis = app.session.state.workingFS[1];

        if (app.session.state.mouse.lastModifiers.alt) {

          // Action when alt held down

          // effect: fix basis direction to the direction of original basis
          // at instant at which modifier was applied
          let e_j = Vec.normalise(basis[j]);
          t = Vec.scale(e_j, Vec.dot(t, e_j));

        }
      }

      if (app.session.state.mouse.lastModifiers.shift) {

        // Action when shift held down

        // effect: fix basis lengths to the length of original basis
        // at instant at which modifier was applied
        if (Vec.mod(t) > 0) {
          t = Vec.scale(t, Vec.mod(basis[j])/(Vec.mod(t)));
        }

      }




      let newBasis = basis;
      newPos = Vec.add(origin, t);
      newBasis[j] = t;


      let newTransforms = app.session.settings.FS.transforms;

      newTransforms[i] = {
        linear: newBasis,
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


  static mutateCombinedLinearComponents(app: I_applicationState) {

    let state = app.session.state;

    if (state.mouse.interactionCandidate) {

      let mouseModifiers = state.mouse.lastModifiers
      Object.entries(mouseModifiers).forEach(s => console.log(s))
      let noModifiers = !Object.entries(mouseModifiers).map(s => s[1]).includes(true);

      let i = state.mouse.interactionCandidate.id[0];
      let basis = app.FS.controlPoints[i].basis;
      let origin = app.FS.controlPoints[i].origin;

      let mousePos = Vec.minus(
        app.display.rig.reverseProject(state.mouse.pos),
        state.mouse.controlPointOffset!
      )

      if (mouseModifiers.ctrl) {

        // Action when ctrl held down

        // effect: constrain coordinate values to grid, i.e. multiples
        // of 0.1
        mousePos = mousePos.map(a => Math.round(a * 10) / 10);

      } 


      let shouldStoreFSValue = !state.workingFS || state.mouse.pendingModifierUpdate;

      if (shouldStoreFSValue) { // write current FS to stored FS

        // when initiating transform or when modifier has changed, 
        // store value of basis at that instance for future reference.
        state.workingFS = [origin, basis];
        state.mouse.pendingModifierUpdate = false;

      } else { // 

        origin = state.workingFS![0];
        basis = state.workingFS![1];


        let t0 = Vec.minus(Vec.sum(origin, basis[0], basis[1]), origin);
        let t1 = Vec.minus(mousePos, origin);

        if (noModifiers || app.session.state.mouse.lastModifiers.shift) {

          // action when alt pressed (and also part of the effect applied
          // when shift is pressed)

          // effect: fix original angle between basis, rotating new basis
          // according to angle made between new origin-mouse vector and
          // the original origin-mouse vector from when the instant at which
          // the modifier was applied

          let theta = Math.atan2(t0[0]*t1[1] - t1[0]*t0[1], Vec.dot(t0, t1))
          let rotMat = new Lin2x2(
            [Math.cos(theta), Math.sin(theta)],
            [-Math.sin(theta), Math.cos(theta)
            ]);
          basis = basis.map(v => rotMat.apply(v));

        } else if (app.session.state.mouse.lastModifiers.meta) {

          // action when meta pressed

          // effect: scale basis proportionally

          let t0_N = Vec.normalise(t0);
          mousePos = Vec.add(origin, Vec.scale(t0_N, Vec.dot(t1, t0_N)));

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
      ].map((a,i) => a == null? basis[i] : Vec.minus(a, origin));

      
      if (app.session.state.mouse.lastModifiers.shift) {

        // action when shift pressed

        // effect: fix basis lengths to the length of original basis
        // at instant at which modifier was applied
        newBasis = newBasis.map((v, i) => Vec.scale(v, Vec.mod(basis[i])/Vec.mod(v)));
      }

      mousePos = Vec.sum(origin, newBasis[0], newBasis[1]);

      newTransforms[i] = {
        linear: newBasis,
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


}
