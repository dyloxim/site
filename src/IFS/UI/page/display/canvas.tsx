import { useEffect, useRef } from 'react'
import { useContext } from "react";
import { SharedUIState } from "@IFS/UI/SharedUIState";
import { default as AppEngine } from "@IFS/app";


const Canvas = ({ setupFn, app }: {
  setupFn: (displayContainer: HTMLDivElement) => void,
  app: AppEngine
}) => {

  const {ctx} = useContext(SharedUIState);

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

    console.log("setting up display container");

    // DefinedDisplayLayers.forEach(layerKey => {
    //   let canvas = 
    //     document.getElementById(`${layerKey}Canvas`)! as HTMLCanvasElement;
    //   console.log(canvas);
    //   let layer = app!.display!.imageComposer.layers[layerKey];
    //   console.log(layer);
    //   layer.material = canvas;
    // })


  }, [setupFn, ctx])


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
