import { I_settings } from "@IFS/types/configuration"
import { NamedFSPreset } from "@IFS/types/specifications"
import { DefinedTicket } from "@IFS/types/tickets"
import { InstructionGroup } from "@IFS/types/tickets"
import { default as FunctionSystem } from "@IFS/functionSystem"
import { default as Display } from "@IFS/display/displayApperatus"
import { I_selectableEntityMetaData, SelectableEntityCategory } from "@IFS/types/interaction"


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

  // list of indicies indicating transforms currently in the active selection
  selected: number[];

  mouse: {
    // pixel pos
    pos: number[],
    // when mouse is down, returns position of mouse at mouse down event, null otherwise
    down: number[] | null,


    // if action is being decided (mouse is down but time has not yet elapsed
    //   to determine whether to simply update the active selection, or whether to begin
    //   a drag interaction) then set this property to the time at which the ambiguity was
    //   triggered -- the time of the offending mouse down event. Otherwise set to null (if
    //   there is no action to be decided or if a decision was already made)

    actionUndecided: number | null, // returns timestamp or null;

    interactionCandidate: null | I_selectableEntityMetaData,

    interactionPrimed: boolean,


    // vector describing offset between mousedown location and selection candidate control
    //   point location
    controlPointOffset: number[] | null

  },

  selectableEntities: {
    [key in SelectableEntityCategory]: I_selectableEntityMetaData[]
  }

  options: {
    running: boolean,
    color: boolean,
    path: null | "recent" | "persist"
    animationRate: number,
    controlPointsShown: boolean,
    preset: NamedFSPreset | "custom",
  },

  tacit: {
    mutatingFS: boolean,
    draggingRig: number[] | null
  }

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
