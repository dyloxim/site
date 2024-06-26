
export default interface I_state {

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
