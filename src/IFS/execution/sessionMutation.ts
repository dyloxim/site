import { SessionAssertion } from "@IFS/types/interaction";
import { I_session } from "@IFS/types/state";
import { InstructionGroup, DefinedTicket } from "@IFS/types/tickets";

export default class SessionMutation {

  private session: I_session;
  private mutation: SessionAssertion;
  private requests: DefinedTicket[];




  constructor(mutation: {
    using: I_session,
    do?: SessionAssertion,
    queue?: (s: I_session) => DefinedTicket[]
  }) {

    let [session, definition, actionGetter] =
      [mutation.using, mutation.do, mutation.queue]

    this.session = session;
    this.mutation = definition? definition : s => s;
    this.requests = actionGetter? actionGetter(session) : [];

  }


  
  result = (): I_session => {

    this.session = this.mutation(this.session);
    this.requests.forEach(t => { this.registerTicket(t) });

    return this.session;

  }



  registerTicket = (ticket: DefinedTicket): void => {

      let category = ticket.instructionGroup as InstructionGroup
      this.session.state.tickets[category].add(ticket);

  }




}
