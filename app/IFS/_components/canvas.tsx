import { useEffect, useRef } from 'react'
import IFSApp from '@IFS/app'

const Canvas = ({ appEngine }: { appEngine: IFSApp }) => {

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const setupApp = (canvas: HTMLCanvasElement) => {
    appEngine.setupDisplay(canvas);
    appEngine.start();
  }

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      setupApp(canvas)
    }
  }, [setupApp])

  return (
    <canvas
      ref={canvasRef}
      style={{imageRendering: "pixelated"}}
      height={700}
      width={700}
    >
    </canvas>
  )
}

export default Canvas;
