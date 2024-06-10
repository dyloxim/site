import I_FunctionSystem from "@IFS/types/I_functionSystem"
import I_DisplayParams from "@IFS/types/I_displayParams"

export default interface I_Preset {
  firstPoint: number[],
  functionSystem: I_FunctionSystem,
  displayParams: I_DisplayParams,
}
