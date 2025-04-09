import { TicketProcessor } from "@IFS/types/interaction"
import { DisplayLayer } from "./specifications"
import { InstructionGroups } from "@IFS/resources/globalConstants"
import { joinWithSeparator } from "@IFS/types/util"

export type InstructionGroup = typeof InstructionGroups[number];


export type SimpleTicket = {
  instructionGroup: InstructionGroup,
  instruction: string,
  processor: TicketProcessor,
  log: boolean
}


export type BasicLayerTicket = SimpleTicket &{
  consumer: DisplayLayer[]
  instructionGroup: "layerErase" | "layerDraw",
  instruction: string,
  log: boolean
}

export type Ticket = SimpleTicket | BasicLayerTicket

const HandleActionKey = "HANDLE" as const
const ReloadActionKey = "RELOAD" as const
const RebuildActionKey = "REBUILD" as const
const ReviewActionKey = "REVIEW" as const
const DoActionKey = "DO" as const

export type LayerActionKey = "ERASE" | "DRAW"


type HandleActionObject = 
      "mouseMoveEvent"
      | "mouseDownEvent"
      | "mouseOutEvent"


type ReloadActionObject =
      "rig"
      | "FS"
      | "controlPoints"
      | "selectionOverlay"
      | "secondaryEntities"


type RebuildActionObject = 
      "rig"


type ReviewActionObject = 
      "controlPoints"


type DoActionObject = 
      "showHoverTarget"
      | "revertRigToInitial"
      | "normaliseControlPoints"
      | "drawSelectionOverlay"
      | "clearSelection"
      | "calibrateDisplay"
      | "drawAxis"
      | "reinitialisePointPosition"



export type ActionId =
[typeof HandleActionKey, HandleActionObject]
| [typeof ReloadActionKey, ReloadActionObject]
| [typeof RebuildActionKey, RebuildActionObject]
| [typeof ReviewActionKey, ReviewActionObject]
| [typeof DoActionKey, DoActionObject]


export const actionKeyGetter = (x: ActionId) => joinWithSeparator(":")(...x);

export type ActionKey = ReturnType<typeof actionKeyGetter>

export type ActionRegistry = Record<ActionKey, SimpleTicket>

export type LayerActionsRef = [LayerActionKey, DisplayLayer[]]

export function isLayerActionsRef(x: ActionKey | LayerActionsRef): x is LayerActionsRef {
  return x[0] === "ERASE" || x[1] === "DRAW";
}

export type QueueItem = ActionKey | LayerActionsRef;
