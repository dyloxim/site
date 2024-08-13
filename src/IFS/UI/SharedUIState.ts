import { createContext } from "react";
import { I_sharedState } from "@IFS/types/state";

export const initialSharedState: I_sharedState = { path: "None" }

export const SharedUIState = createContext<{
  ctx: I_sharedState,
  setCtx: React.Dispatch<React.SetStateAction<I_sharedState>>
}>({
  ctx: initialSharedState,
  setCtx: _ => initialSharedState
})
