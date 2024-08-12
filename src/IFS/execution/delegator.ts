import { AppStateProcessor } from "@IFS/types/interaction"
import { InstructionGroups } from "@IFS/resources/globalConstants"

import { default as IFSAppWorker } from "@IFS/execution/IFSAppWorker"
import { default as MouseProcessor } from "@IFS/execution/mouseProcessor";


export default class Delegator {

  // public entry points

  static doFirstDraw: AppStateProcessor = (app) => {
    Delegator.dispatchTicketProcessors(app);
  }

  static handleTurn: AppStateProcessor = (app) => {


    Delegator.dispatchTicketProcessors(app);

    if (app.session.state.mouse.actionUndecided) {
      MouseProcessor.maybeDecideMouseAction(app);
    }


    if (app.session.state.options.running) {

      IFSAppWorker.maybeErasePastPaths(app);

      Array.from({ length: app.session.state.options.animationRate }, _ =>  {
        IFSAppWorker.movePiece(app)
        IFSAppWorker.maybeMarkLastPath(app);
        IFSAppWorker.maybeMarkPoint(app);
      });

      IFSAppWorker.maybeRefreshPathOverlay(app);
      app.display.imageComposer.layers.figure.commit();

    }

  }

  private static dispatchTicketProcessors: AppStateProcessor = (app) => {

    InstructionGroups.forEach(instructionGroup => {

      let ticketGroup = app.session.state.tickets[instructionGroup]

      while (ticketGroup.size !== 0) {

        ticketGroup.forEach(ticket =>
          {
            if (ticket.log) console.log(`processing ticket: ${ticket.instruction}`) 
            ticket.processor(app, ticket); ticketGroup.delete(ticket);
          }
        );

      }});
  }

}
