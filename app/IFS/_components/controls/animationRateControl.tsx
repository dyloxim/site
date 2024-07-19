import { useState } from "react";
import { I_session } from "@IFS/types/state";
import { I_numericControlSpecification } from "@IFS/types/interaction";
import NumericControl from "./kinds/numericControl";

export default function AnimationRateControl({ session, updateSession }: {
  session: I_session,
  updateSession: (session: I_session) => void
}) {

  const [animationRate, setAnimationRate] = useState<number>(1);

  const animationControl: I_numericControlSpecification = {
    key: "animationRate",
    text: "Steps per frame",
    value: animationRate,
    setter: setAnimationRate,
    mutation: e => s => { s.state.options.animationRate = Number(e.target.value); return s },
    ticketsGetter: _ => []
  }

  return (
    <>
      <NumericControl
        session={session}
        updateSession={updateSession}
        specification={animationControl}
      /> &nbsp;
    </>
  )
}
