import Vec2 from "@IFS/math/linearAlgebra/vec2"
import I_session from "@IFS/types/I_session";
import IFS_interact from "@IFS/interaction";
import { useState } from "react";

export default function Controls({ session, updateSession }: {
  session: I_session,
  updateSession: (session: I_session) => void
}) {

  const [panStep, setPanStep] = useState<number>(0.2);
  const [zoomStep, setZoomStep] = useState<number>(1.1);
  const [resolutionScaleStep, setResolutionScaleStep] = useState<number>(1.1);
  const [animationRate, setAnimationRate] = useState<number>(1);

  function pan(bearing: string) {
    const compass = new Map([
      ['N', [ 0, 1]],
      ['S', [ 0,-1]],
      ['E', [ 1, 0]],
      ['W', [-1, 0]],
    ]);
    updateSession(
      IFS_interact.pan(Vec2.scale(compass.get(bearing)!, panStep), session)
    );
  }

  const zoom = (way: string) => {
    if (way == '+') {
    updateSession(
      IFS_interact.zoom(zoomStep, session)
    );
    } else if (way == '-') {
      IFS_interact.zoom(1 / zoomStep, session)
    }
  }

  const startOrStop = (way: string) => {
    if (way == '▶') {
      updateSession(IFS_interact.resume(session));
    } else if (way == '⏹') {
      updateSession(IFS_interact.freeze(session));
    }
  }

  const updateAnimationRate = (stepsPerFrame: number) => {
    setAnimationRate(stepsPerFrame)
    updateSession(
      IFS_interact.setAnimationRate(stepsPerFrame, session)
    )
  }

  const toggleColor = () => {
    updateSession(
      IFS_interact.setColorStyle(!session.settings.display.color.multi, session)
    )
  }

  const updateResolutionScaling = (way: string) => {
    if (way == '+') {
    updateSession(
      IFS_interact.updateResolutionScaling(1.1, session)
    );
    } else if (way == '-') {
      IFS_interact.updateResolutionScaling(1 / 1.1, session)
    }
  }

  return (
    <div>
      <form>
        Pan Step: <input
                    name="panStep"
                    type="number"
                    value={panStep}
                    onChange={e => setPanStep(Number(e.target.value))}
        />
        <br/>
        Zoom Step: <input
                     name="zoomStep"
                     type="number"
                     value={zoomStep}
                     onChange={e => setZoomStep(Number(e.target.value))}
        />
        <br/>
        Resolution Scaling Step: <input
                     name="animationRate"
                     type="number"
                     value={resolutionScaleStep}
                     onChange={e => setResolutionScaleStep(Number(e.target.value))}
        />
        <br/>
        Animation Rate: <input
                     name="animationRate"
                     type="number"
                     value={animationRate}
                     onChange={e => updateAnimationRate(Number(e.target.value))}
        />
      </form>
      Pan Display Region: {['N', 'E', 'S', 'W'].map(dir => (
        <button key={dir} onClick={() => pan(dir)}>{dir}</button>
      ))}
      <br/>
      Zoom: {['+', '-'].map(dir => (
        <button key={dir} onClick={() => zoom(dir)}>{dir}</button>
      ))}
      <br/>
      Stop / Start Animation: {['⏹', '▶'].map(val => (
        <button key={val} onClick={() => startOrStop(val)}>{val}</button>
      ))}
      <br/>
      Toggle color: <button onClick={(() => toggleColor())}>toggle</button>
      <br/>
      Adjust resolution: {['+', '-'].map(dir => (
        <button key={dir} onClick={() => updateResolutionScaling(dir)}>{dir}</button>
      ))}
    </div>
  )
}
