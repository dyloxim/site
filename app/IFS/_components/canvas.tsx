import { useEffect, useRef } from 'react'

import { I_session } from "@IFS/types/state";


const Canvas = ({ setupFn, session, updateSession }: {
  setupFn: (displayContainer: HTMLDivElement) => void,
  session: I_session,
  updateSession: (session: I_session) => void
}) => {

  const displayContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {

    if (displayContainerRef.current) {

      displayContainerRef.current!.style.width = `${window.innerWidth}px`;
      displayContainerRef.current!.style.height = `${window.innerHeight * 4/5}px`;

      setupFn(displayContainerRef.current)


        

    }

    window.addEventListener('resize', _ => {
      displayContainerRef.current!.style.width = `${window.innerWidth}px`;
      displayContainerRef.current!.style.height = `${window.innerHeight * 4/5}px`;
      setupFn(displayContainerRef.current!)
    })

  }, [setupFn])

  return (
    <>
      <div
        ref={displayContainerRef}
        id="displayContainer"
        style={{
          position: "relative",
          width: "1100px",
          height: "1100px"
        }}>
      </div>
    </>
  )
}

export default Canvas;
