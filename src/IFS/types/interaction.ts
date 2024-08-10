import { SelectableEntityCategories } from "@IFS/resources/globalConstants";
import { I_applicationState, I_session } from "@IFS/types/state";
import { Ticket } from "@IFS/types/tickets";


// function types

export type SessionAssertion = (s: I_session, ...parameters: any) => I_session;

export type AppStateProcessor = (app: I_applicationState) => void;

export type AppDerivedStateGetter = (app: I_applicationState) => any;


// component specs

export type TicketProcessor = (
  app: I_applicationState,
  ticket?: Ticket
) => void;


// entity data structure

export type SelectableEntityCategory = typeof SelectableEntityCategories[number]

export interface I_selectableEntityMetaData {
  id: number[],
  type: SelectableEntityCategory,
  pos: number[],
  isProximal: boolean,
}

