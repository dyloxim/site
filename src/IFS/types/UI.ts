import SessionMutation from "@IFS/execution/sessionMutation";
import { I_session } from "@IFS/types/state";

export interface I_UIContext {
  session: I_session,
  updateSession: (session: I_session) => void
}

export interface I_rangeInput {
  key: string,
  label: string,
  initial: number,
  min: number, max: number,
  steps: number,
  effect: (e: React.ChangeEvent<HTMLInputElement>, s: I_session) => SessionMutation,
}

export interface I_buttonInput {
  key: string,
  label: string,
  effect: (s: I_session) => SessionMutation
}

export interface I_checkBox {
  key: string,
  label: string,
  initial: boolean,
  effect: (s: I_session) => SessionMutation
}

export interface I_toggleInput {
  key: string,
  onLabel: string,
  offLabel: string,
  initial: boolean,
  effect: (s: I_session) => SessionMutation
}

export interface I_numberInput {
  key: string,
  label: string,
  initial: number,
  effect: (e: React.ChangeEvent<HTMLInputElement>, s: I_session) => SessionMutation,
}

export interface I_selectInput {
  initial: any,
  mainKey: string,
  mainLabel: string,
  effect: (option: string, s: I_session) => SessionMutation,
  options: {
    key: string,
    label: string,
  }[]
}
