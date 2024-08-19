import SessionMutation from "@IFS/execution/sessionMutation";
import { I_session, PathOption } from "@IFS/types/state";
import { I_displayConfig, I_functionSystem } from "./configuration";
import { default as AppEngine } from "@IFS/app";
import { I_transform } from "./mathematical";

export interface I_UIContext {
  FS: I_transform[],
  path: PathOption,
  pathDisabled: boolean,
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
  mainLabel: string,
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
  key: string,
  label: string,
  options: I_optionInput[]
}

export interface I_optionInput {
  key: string,
  label: string,
  effect: (s: I_session) => SessionMutation
}

export type SetupInputs = {
  app: AppEngine,
  container: HTMLDivElement,
  session: I_session, 
  preset: {
    display: I_displayConfig,
    FS: I_functionSystem
  },
  Ctx: {
    ctx: I_UIContext,
    setCtx: React.Dispatch<React.SetStateAction<I_UIContext>>
  },
  resizeFn: (div: HTMLDivElement, session: I_session) => void
}

export type SetupFn = (inputs: SetupInputs) => void;

export type EventResponseSetup = (
  canvas: HTMLCanvasElement,
  session: I_session,
  Ctx: {
    ctx: I_UIContext,
    setCtx: React.Dispatch<React.SetStateAction<I_UIContext>>
  }
) => void;
