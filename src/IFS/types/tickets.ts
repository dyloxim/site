import { TicketProcessor } from "@IFS/types/interaction"
import { definedTickets } from "@IFS/resources/tickets"
import { DisplayLayer } from "./specifications"

export type InstructionGroup = "mouse" | "FS" | "rig" | "process" | "layerErase" | "layerDraw"

export type SimpleTicket = {
  instructionGroup: InstructionGroup,
  instruction: string,
  processor: TicketProcessor
}

let instructionStringWriter = (p: ["Erase" | "Draw", DisplayLayer]) => `${p[0]} ${p[1]}`

export type LayerTicketInstructionString = ReturnType<typeof instructionStringWriter>

export type BasicLayerTicket = SimpleTicket &{
  consumer: DisplayLayer
  instructionGroup: "layerErase" | "layerDraw",
  instruction: LayerTicketInstructionString
}

export type DefinedTicket = typeof definedTickets[number] | BasicLayerTicket
