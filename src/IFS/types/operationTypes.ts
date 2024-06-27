import { I_settings } from "@IFS/types/configTypes"

export interface I_state {

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
    running: boolean,
    frameTimes: {
      first: number | null,
      previous: number | null,
    }
  },

  interaction: {
    wantsRedraw: boolean,
    updatePending: boolean
  }

}

export interface I_session {
  settings: I_settings,
  state: I_state,
}
