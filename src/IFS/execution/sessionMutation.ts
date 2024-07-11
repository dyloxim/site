import { SessionAssertion } from "@IFS/types/interaction";
import { I_session } from "@IFS/types/state";
import { InstructionGroup, DefinedTicket } from "@IFS/types/tickets";

export default class SessionMutation {

  private s: I_session
  private ticketsGetter: (s: I_session) => DefinedTicket[];

  constructor(inputs: {
    session: I_session,
    assertion: SessionAssertion,
    ticketsGetter: (s: I_session) => DefinedTicket[]
  }) {
    this.s = inputs.assertion(inputs.session);
    this.ticketsGetter = inputs.ticketsGetter;
  }

  gives = (): I_session => {
    this.ticketsGetter(this.s).forEach(ticket => {
      this.s.state.tickets[ticket.instructionGroup as InstructionGroup].add(ticket);
    })
    return this.s;
  }


}
