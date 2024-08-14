import { default as SessionMutation } from "@IFS/execution/sessionMutation"
import { I_session } from '@IFS/types/state'
import { I_transform } from "@IFS/types/mathematical";


const setupMouseUpHandler = (
  canvas: HTMLCanvasElement,
  session: I_session,
  setFS: (FS: I_transform[]) =>void
) => {

  canvas!.addEventListener('mouseup', (_: MouseEvent): void => {

    new SessionMutation({ using: session, do: s => {

      s.state.mouse.down = null;
      s.state.tacit.draggingRig = null;
      s.state.tacit.mutatingFS = false;
      s.state.mouse.interactionPrimed = false;
      s.state.inputSelected = null;
      setFS(s.settings.FS.transforms);

      return s;

    }}).eval();

  }, false);

}

export default setupMouseUpHandler;
