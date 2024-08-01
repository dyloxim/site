import { useEffect, useRef } from 'react'
import { default as SessionMutation } from "@IFS/execution/sessionMutation"

import { I_session } from "@IFS/types/state";

import * as Actions from "@IFS/resources/tickets"

const Canvas = ({ setupFn, session, updateSession }: {
  setupFn: (displayContainer: HTMLDivElement) => void,
  session: I_session,
  updateSession: (session: I_session) => void
}) => {

  const displayContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {

    if (displayContainerRef.current) {

      setupFn(displayContainerRef.current)

      let canvas = document.getElementById("hoverOverlayCanvas")! as HTMLCanvasElement;

      // MOUSE MOVE EVENT

      canvas.addEventListener('mousemove', (e: MouseEvent) => {

        updateSession(new SessionMutation({ using: session, do: s => {

            let rect = canvas.getBoundingClientRect();
            s.state.mouse.pos = [
              (e.clientX - rect.left) / (rect.right - rect.left) * canvas.width,
              (e.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
            ]
            return s;

          }, queue: s => {

            let tickets = [Actions.handleMouseMoveEvent];
            if (s.state.tacit.mutatingFS) tickets = [...tickets, Actions.showHoverTarget]
            if (s.state.tacit.draggingRig) tickets = [...tickets, Actions.reloadRig]
            return tickets;

          }}).result());

      }, false);


      // MOUSE DOWN EVENT

      canvas!.addEventListener('mousedown', (_: MouseEvent): void => {

        updateSession(new SessionMutation({ using: session, do: s => {

          s.state.mouse.down = s.state.mouse.pos;
          return s;

        }, queue: _ => [

          Actions.handleMouseDownEvent

        ]}).result());

      }, false);


      // MOUSE UP EVENT

      canvas!.addEventListener('mouseup', (_: MouseEvent): void => {

        updateSession(new SessionMutation({ using: session, do: s => {

          s.state.mouse.down = null;
          s.state.tacit.draggingRig = null;
          s.state.tacit.mutatingFS = false;
          s.state.mouse.interactionPrimed = false;

          return s;

        }}).result());

      }, false);


      // MOUSE SCROLL EVENT

      canvas!.addEventListener('wheel', (e: WheelEvent): void => {
        if (e.deltaY != 0 && e.ctrlKey) {

          e.preventDefault(); e.stopPropagation()

          updateSession(new SessionMutation({ using: session, do: s => {

              let normalizeFn = (x: number) => - (1/((x/5)+5)) + .2;
              let multiplier = (_ => {
                if (e.deltaY > 0) return 1 + normalizeFn(e.deltaY);
                else return 1 - normalizeFn(-e.deltaY);
              })()
              let newDisplayRadius = s.settings.display.domain.displayRadius * multiplier;
              s.settings.display.domain.displayRadius = newDisplayRadius;
              return s;

          }, queue: _ => [

            Actions.reloadRig

          ]}).result());

        }}, false);

    }

  }, [setupFn])

  return (
    <>
      <div
        ref={displayContainerRef}
        style={{
          position: "relative",
          width: (typeof window !== 'undefined') ? window.innerWidth : "700px",
          height: "1100px"
        }}>
      </div>
    </>
  )
}

export default Canvas;
