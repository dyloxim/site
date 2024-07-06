import { AppStateProcessor } from "@IFS/types/interaction";
import { default as SessionMutation } from "@IFS/execution/sessionMutation";
import { default as Vec } from "@IFS/math/linearAlgebra/vec2"

export default class FSMutator {
  static maybeTranslateBoundingBox: AppStateProcessor = (app): void => {
    if (app.session.state.mouse.selectionCandidate
      && app.session.state.mouse.down) {
        console.log("translating bounding box");
      }
  }

  static translateTransformedBasis: AppStateProcessor = (app): void => {
    console.log("translating transformed basis");
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
