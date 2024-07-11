import { I_sessionState } from "@IFS/types/state";
import { DefinedTicket } from "@IFS/types/tickets";

export const defaultState: I_sessionState = {

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
    frameTimes: {
      first: null,
      previous: null,
    }
  },


  mouse: {
    moved: false,
    pos: [0,0],
    down: null,
    proximities: null,
    selectionOffset: null,
    selectionCandidate: null,
  },

  options: {
    preset:"custom",
    animationRate: 1,
    running: true,
    bboxes: false,
    path: "recent",
    color: false,
  },

  tickets: {
    mouse: new Set<DefinedTicket>(),
    FS: new Set<DefinedTicket>(),
    rig: new Set<DefinedTicket>(),
    process: new Set<DefinedTicket>(),
    layerDraw: new Set<DefinedTicket>(),
    layerErase: new Set<DefinedTicket>(),
  },

  tacit: {
    mutatingFS: false,
    draggingRig: null
  }

}

