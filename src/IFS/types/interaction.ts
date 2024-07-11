import { I_applicationState, I_session } from "@IFS/types/state";
import { DefinedTicket } from "@IFS/types/tickets";

export type SessionAssertion = (s: I_session, ...parameters: any) => I_session;

export type AppStateProcessor = (app: I_applicationState) => void;

export type AppDerivedStateGetter = (app: I_applicationState) => any;

export type TicketProcessor = (
  app: I_applicationState,
  ticket?: DefinedTicket
) => void;

export interface I_categoricControlSpecification {
  key: string,
  text: string,
  mutation: SessionAssertion,
  ticketsGetter: (s: I_session) => DefinedTicket[]
}

export interface I_numericControlSpecification {
  key: string,
  text: string,
  value: number,
  setter: React.Dispatch<React.SetStateAction<number>>,
  mutation: (e: React.ChangeEvent<HTMLInputElement>) => SessionAssertion,
  ticketsGetter: (s: I_session) => DefinedTicket[]
}
