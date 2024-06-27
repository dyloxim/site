import { useEffect, useRef } from 'react'
import IFSApp from '@IFS/app'

const Canvas = ({ appEngine }: { appEngine: IFSApp }) => {

  const displayContainerRef = useRef<HTMLDivElement | null>(null);

  const setupApp = (displayContainer: HTMLDivElement) => {
    appEngine.setupDisplay(displayContainer);
    appEngine.start();
  }

  useEffect(() => {
    if (displayContainerRef.current) {
      setupApp(displayContainerRef.current)
    }
  }, [setupApp])

  return (
    <div
      ref={displayContainerRef}
      style={{
      position: "relative",
      width: "700px",
      height: "700px"
      }}>
    </div>
  )
}

export default Canvas;
