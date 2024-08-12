import { useEffect, useRef } from 'react'


const Canvas = ({ setupFn }: {
  setupFn: (displayContainer: HTMLDivElement) => void,
}) => {

  const displayContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {

    if (displayContainerRef.current) {
      let width = document.body.clientWidth
      displayContainerRef.current!.style.width = `${width}px`;
      displayContainerRef.current!.style.height = `${window.innerHeight - 180}px`;
      setupFn(displayContainerRef.current)
    }

    window.addEventListener('resize', _ => {
      let width = document.body.clientWidth
      displayContainerRef.current!.style.width = `${width}px`;
      displayContainerRef.current!.style.height = `${window.innerHeight - 180}px`;
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
          width: "0px",
          height: "0px",
          border: "solid #2d2d2f 1px"
        }}>
      </div>
    </>
  )
}

export default Canvas;
