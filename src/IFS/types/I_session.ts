import I_settings from "./I_settings";
import I_state from "./I_state";

export default interface I_session {
  settings: I_settings,
  state: I_state,
}
