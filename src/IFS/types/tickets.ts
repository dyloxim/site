import { TicketProcessor } from "@IFS/types/interaction"
import { definedTickets } from "@IFS/resources/tickets"
import { DisplayLayer } from "./specifications"

export type InstructionGroup = "mouse" | "FS" | "rig" | "process" | "layerErase" | "layerDraw"

export type SimpleTicket = {
  instructionGroup: InstructionGroup,
  instruction: string,
  processor: TicketProcessor
}

export type BasicLayerTicket = SimpleTicket &{
  consumer: DisplayLayer
  instructionGroup: "layerErase" | "layerDraw",
  instruction: "ensureShown" | "ensureHidden" | "erase"
}

export type DefinedTicket = typeof definedTickets[number] | BasicLayerTicket
