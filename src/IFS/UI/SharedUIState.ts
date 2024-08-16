import { createContext } from "react";
import { I_session } from "@IFS/types/state";
import { defaultInitialSession } from "@IFS/resources/globalConstants"

export const SharedUIState = createContext<{
  session: I_session,
  updateSession: React.Dispatch<React.SetStateAction<I_session>>
}>({
  session: defaultInitialSession,
  updateSession: () => defaultInitialSession
})
