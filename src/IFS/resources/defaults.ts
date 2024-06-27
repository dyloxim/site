import { I_state } from "@IFS/types/operationTypes";

export const defaultState: I_state = {
  program: {
    thisTurn: {
      position: [0,0],
      choice: -1,
    },
    lastTurn: {
      position: [0,0],
      choice: -1,
    }
  },
  animation: {
    running: false,
    frameTimes: {
      first: null,
      previous: null,
    }
  },
  interaction: {
    wantsRedraw: false,
    updatePending: false
  }
}
