import { TicketProcessor } from "@IFS/types/interaction"
import { definedTickets } from "@IFS/resources/tickets"
import { DisplayLayer } from "./specifications"
import { InstructionGroups } from "@IFS/resources/globalConstants"

export type InstructionGroup = typeof InstructionGroups[number];

export type SimpleTicket = {
  instructionGroup: InstructionGroup,
  instruction: string,
  processor: TicketProcessor,
  log: boolean
}

let instructionStringWriter = (p: ["Erase" | "Draw", DisplayLayer]) => `${p[0]} ${p[1]}`

export type LayerTicketInstructionString = ReturnType<typeof instructionStringWriter>

export type BasicLayerTicket = SimpleTicket &{
  consumer: DisplayLayer[]
  instructionGroup: "layerErase" | "layerDraw",
  instruction: LayerTicketInstructionString,
  log: boolean
}

export type DefinedTicket = typeof definedTickets[number] | BasicLayerTicket
