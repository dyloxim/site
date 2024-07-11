import { default as SessionMutation } from "@IFS/execution/sessionMutation";
import { default as Vec } from "@IFS/math/linearAlgebra/vec2"

import { AppStateProcessor } from "@IFS/types/interaction";

import * as CommonTickets from "@IFS/resources/tickets"

import { I_affine } from "@IFS/types/mathematical";

export default class FSMutator {
  static maybeTranslateBoundingBox: AppStateProcessor = (app): void => {
    if (app.session.state.tacit.mutatingFS) {
      let [i, j] = app.session.state.mouse.selectionCandidate!;
      let oldVert = app.FS.bboxes.transformed[i][j];
      let newVert = Vec.add(
        app.display.rig.reverseProject(app.session.state.mouse.pos),
        app.session.state.mouse.selectionOffset!
      )
      let oldTranslation = (_ => {
        let transform = (app.session.settings.FS.transforms[i] as I_affine)
        if (transform.translation != undefined) {
          return transform.translation;
        } else {
          return [0,0];
        }
      })();
      let oldLinear = (app.session.settings.FS.transforms[i] as I_affine).linear
      app.session = new SessionMutation({
        session: app.session,
        assertion: s => {
          s.settings.FS.transforms[i] = {
            linear:  oldLinear,
            translation: Vec.add(oldTranslation, Vec.minus(newVert, oldVert))
          }
          return s
          // F = [[Fa, Fb], [Fc, Fd]] ,,,  G = [[Ga, Gb], [Gc, Gd]]
          // p = [[pa, pb], [pc, pd]]
          // [pa, pb] = [[Ga * Fa + Gb * Fc], [Ga * Fb + Gb * Fd]]
        },
        ticketsGetter: _ => [
          CommonTickets.reloadFS,
          CommonTickets.reloadBboxes
        ]
      }).gives()
    }
  }

  static rotateBoundingBox: AppStateProcessor = (app): void => {
    console.log("rotating bounding box");
  }

  static handleFSTransform: AppStateProcessor  = (app): void => {
    if (app.session.state.mouse.down && app.session.state.mouse.selectionCandidate) {
      let [i, j] = app.session.state.mouse.selectionCandidate;

      if (!app.session.state.mouse.selectionOffset) {
        app.session = new SessionMutation({
          session: app.session,
          assertion: s => {
            s.state.mouse.selectionOffset = Vec.minus(
              app.display.rig.reverseProject(s.state.mouse.down!),
              app.FS.bboxes.transformed[i][j]
            )
            return s;
          },
          ticketsGetter: _ => []
        }).gives();
      }

      switch (j) {
        case 0:
          let newBbox = app.FS.bboxes.transformed[i].map((_, k) => Vec.sum(
            app.display.rig.reverseProject(app.session.state.mouse.pos),
            app.session.state.mouse.selectionOffset!,
            Vec.minus(
              app.FS.bboxes.transformed[i][k],
              app.FS.bboxes.transformed[i][0]
            )
          ));
          break;
        case 1:
        case 3:
          app.FS.bboxes.transformed[i][j] = Vec.sum(
            app.display.rig.reverseProject(app.session.state.mouse.pos),
            app.session.state.mouse.selectionOffset!,
          );
          break;
        case 2:
          break;
      }
    }
  }

}
