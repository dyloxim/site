import { AppStateProcessor } from "@IFS/types/interaction"
import { InstructionGroup } from "@IFS/types/tickets";

import { default as IFSAppWorker } from "@IFS/execution/IFSAppWorker"
import { default as FSMutator } from "@IFS/execution/FSMutator";

export default class Delegator {

  // public entry points

  static doFirstDraw: AppStateProcessor = (app) => {
    Delegator.dispatchTicketProcessors(app);
  }

  static handleTurn: AppStateProcessor = (app) => {
    Delegator.dispatchTicketProcessors(app);
    FSMutator.maybeTranslateBoundingBox(app);
    if (app.session.state.options.running) {
      IFSAppWorker.maybeErasePastPaths(app);
      Array.from({ length: app.session.state.options.animationRate }, _ =>  {
        IFSAppWorker.movePiece(app)
        IFSAppWorker.maybeMarkLastPath(app);
        IFSAppWorker.maybeMarkPoint(app);
      });
      IFSAppWorker.maybeRefreshPathOverlay(app);
    }
    app.display.imageComposer.layers.figure.commit();
  }

  private static dispatchTicketProcessors: AppStateProcessor = (app) => {
    (["mouse", "FS", "rig", "process", "layerErase", "layerDraw"] as InstructionGroup[])
      .forEach(appElement => {
        while (app.session.state.tickets[appElement].size !== 0) {
          app.session.state.tickets[appElement].forEach(ticket => {
            ticket.processor(app, ticket);
            app.session.state.tickets[appElement].delete(ticket);
          });
        }
      });
  }

}
