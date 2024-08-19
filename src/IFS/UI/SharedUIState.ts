import { createContext } from "react";
import { defaultInitialSession } from "@IFS/resources/globalConstants"
import { I_UIContext } from "@IFS/types/UI";

export const Ctx = createContext<{
  ctx: I_UIContext,
  setCtx: React.Dispatch<React.SetStateAction<I_UIContext>>
}>({
  ctx: {
    FS: [],
    path: "None",
    pathDisabled: false
  },
  setCtx: () => defaultInitialSession
})
