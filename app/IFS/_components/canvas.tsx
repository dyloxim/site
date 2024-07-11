import { useEffect, useRef } from 'react'
import { default as SessionMutation } from "@IFS/execution/sessionMutation"

import { I_session } from "@IFS/types/state";

import * as CommonTickets from "@IFS/resources/tickets"
import * as Globals from "@IFS/resources/globalConstants";

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

      // MOUSE MOVE EVENT

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
          ticketsGetter: s => {
            let tickets = [CommonTickets.handleMouseMoveEvent];
            if (s.state.tacit.mutatingFS) tickets = [...tickets, CommonTickets.highlightSelection]
            if (s.state.tacit.draggingRig) tickets = [...tickets, CommonTickets.reloadRig]
            return tickets;
          }
        }).gives());
      }, false);


      // MOUSE DOWN EVENT

      canvas!.addEventListener('mousedown', (_: MouseEvent): void => {
        updateSession(new SessionMutation({
          session: session,
          assertion: (s) => { s.state.mouse.down = s.state.mouse.pos; return s; },
          ticketsGetter: _ => [CommonTickets.handleMousePressEvent]
        }).gives());
      }, false);


      // MOUSE UP EVENT

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


      // MOUSE SCROLL EVENT

      canvas!.addEventListener('wheel', (e: WheelEvent): void => {
        if (e.deltaY != 0 && e.ctrlKey) {
          e.preventDefault(); e.stopPropagation()
          updateSession(new SessionMutation({
            session: session,
            assertion: (s) => {
              let normalizeFn = (x: number) => - (1/((x/5)+5)) + .2;
              let multiplier = (_ => {
                if (e.deltaY > 0) return 1 + normalizeFn(e.deltaY);
                else return 1 - normalizeFn(-e.deltaY);
              })()
              let newDisplayRadius = s.settings.display.domain.displayRadius * multiplier;
              s.settings.display.domain.displayRadius = newDisplayRadius;
              return s;
            },
            ticketsGetter: _ => [CommonTickets.reloadRig]
          }).gives());
        }
      }, false);

    }
  }, [setupFn])

  return (
    <>
      <div
        ref={displayContainerRef}
        style={{
          position: "relative",
          width: window.innerWidth,
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
