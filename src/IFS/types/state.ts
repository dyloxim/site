import { I_settings } from "@IFS/types/configuration"
import { NamedFSPreset } from "@IFS/types/specifications"
import { DefinedTicket } from "@IFS/types/tickets"
import { InstructionGroup } from "@IFS/types/tickets"
import { default as FunctionSystem } from "@IFS/functionSystem"
import { default as Display } from "@IFS/display/displayApperatus"


export interface I_sessionState {

  program: {
    thisTurn: {
      position: number[],
      choice: number,
    },
    lastTurn: {
      position: number[],
      choice: number,
    }
  },

  animation: {
    frameTimes: {
      first: number | null,
      previous: number | null,
    }
  },

  mouse: {
    moved: boolean,
    pos: number[],
    down: number[] | null,
    proximities: boolean[][] | null,
    selectionCandidate: number[] | null,
    selectionOffset: number[] | null
  },

  options: {
    preset: NamedFSPreset | "custom",
    animationRate: number,
    running: boolean,
    bboxes: boolean,
    path: null | "recent" | "persist"
    color: boolean,
  },

  tickets: {
    [key in InstructionGroup]: Set<DefinedTicket>
  }

}

export interface I_session {
  settings: I_settings,
  state: I_sessionState,
}

export interface I_applicationState {
  session: I_session,
  FS: FunctionSystem,
  display: Display
}
