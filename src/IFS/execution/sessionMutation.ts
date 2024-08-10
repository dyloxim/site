import { SessionAssertion } from "@IFS/types/interaction";
import { I_session } from "@IFS/types/state";
import { InstructionGroup, ActionKey, LayerActionKey, isLayerActionsRef, QueueItem } from "@IFS/types/tickets";
import { Actions, layerUpdateAction } from "@IFS/resources/tickets"
import { DisplayLayer } from "@IFS/types/specifications";

export default class SessionMutation {

  private session: I_session;
  private mutation: SessionAssertion;
  private requests: (QueueItem)[];




  constructor(mutation: {
    using: I_session,
    do?: SessionAssertion,
    queue?: (s: I_session) => (QueueItem)[],
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

  registerTicket = (ref: QueueItem): void => {

    if (isLayerActionsRef(ref)) this.registerLayerTickets(ref);

    else this.registerOrdinaryTicket(ref);

  }


  registerOrdinaryTicket = (actionKey: ActionKey): void => {

    let ticket = Actions[actionKey]
    let category = ticket.instructionGroup as InstructionGroup
    this.session.state.tickets[category].add(ticket);

  }

  registerLayerTickets = ([instruction, layers]: [LayerActionKey, DisplayLayer[]]): void => {

    let ticket = layerUpdateAction(instruction, layers);
    let category = ticket.instructionGroup as InstructionGroup
    this.session.state.tickets[category].add(ticket);

  }



}

