import { I_sessionState } from "@IFS/types/state";
import { Ticket } from "@IFS/types/tickets";

export const defaultState: I_sessionState = {

  program: {
    thisTurn: {
      position: [0,0],
      choice: -1,
    },
    lastTurn: {
      position: [0,0],
      choice: -1,
    },
    randomSeed: (Math.random()*2**32)>>>0

  },

  animation: {
    frameTimes: {
      first: null,
      previous: null,
    }
  },


  mouse: {
    pos: [0,0],
    down: null,
    actionUndecided: null,
    interactionCandidate: null,
    interactionPrimed: false,
    controlPointOffset: null,
    touchDist: 0,
    displayRescaleInitialRadius: null,
  },

  selected: [],
  inputSelected: null,

  options: {
    preset:"custom",
    animationRate: 1,
    running: true,
    controlPointsShown: false,
    path: "None",
    color: true,
    trace: false,
  },

  selectableEntities: {
    primaryControlPoints: [],
    secondaryControlPoints: []
  },
    

  tickets: {
    mouse: new Set<Ticket>(),
    FS: new Set<Ticket>(),
    rig: new Set<Ticket>(),
    IFSprocess: new Set<Ticket>(),
    layerDraw: new Set<Ticket>(),
    layerErase: new Set<Ticket>(),
  },

  tacit: {
    mutatingFS: false,
    draggingRig: null,
    pendingRerender: false
  }

}

