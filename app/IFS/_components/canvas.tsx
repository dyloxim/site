import { useEffect, useRef } from 'react'
import { I_session } from "@IFS/types/state";
import { default as SessionMutation } from "@IFS/execution/sessionMutation"
import * as CommonTickets from "@IFS/resources/tickets"

const Canvas = ({ setupFn, session, updateSession }: {
  setupFn: (displayContainer: HTMLDivElement) => void,
  session: I_session,
  updateSession: (session: I_session) => void
}) => {

  const displayContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {

    if (displayContainerRef.current) {

      setupFn(displayContainerRef.current)

      let canvas = document.getElementById("selectionOverlayCanvas")! as HTMLCanvasElement;

      canvas.addEventListener('mousemove', (e: MouseEvent) => {
        updateSession(new SessionMutation({
          session: session,
          assertion: (s) => {
            let rect = canvas.getBoundingClientRect();
            s.state.mouse.pos = [
              (e.clientX - rect.left) / (rect.right - rect.left) * canvas.width,
              (e.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
            ]
            return s;
          },
          ticketsGetter: _ => [CommonTickets.handleMouseMoveEvent]
        }).gives());
      }, false);

      canvas!.addEventListener('mousedown', (_: MouseEvent): void => {
        updateSession(new SessionMutation({
          session: session,
          assertion: (s) => { s.state.mouse.down = s.state.mouse.pos; return s; },
          ticketsGetter: _ => [CommonTickets.handleMousePressEvent]
        }).gives());
      }, false);

      canvas!.addEventListener('mouseup', (_: MouseEvent): void => {
        updateSession(new SessionMutation({
          session: session,
          assertion: (s) => {
            s.state.mouse.down = null;
            s.state.mouse.selectionOffset = null;
            return s;
          },
          ticketsGetter: _ => [CommonTickets.handleMousePressEvent]
        }).gives());
      }, false);

    }
  }, [setupFn])

  return (
    <>
      <div
        ref={displayContainerRef}
        style={{
          position: "relative",
          width: "700px",
          height: "1100px"
        }}>
      </div>
      <p>mouse pos is: {
        session ? Math.round(session.state.mouse.pos[0]) : "?"
      },{
        session ? Math.round(session.state.mouse.pos[1]) : "?"
      }</p>
    </>
  )
}

export default Canvas;
