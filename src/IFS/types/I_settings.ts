import I_functionSystem from "@IFS/types/I_functionSystem"
import I_displayConfig from "@IFS/types/I_displayConfig"

export default interface I_settings {
  program: {
    FS: I_functionSystem,
    firstPoint: number[]
  },
  display: I_displayConfig,
  animation: {
    rate: number,
  }
}
