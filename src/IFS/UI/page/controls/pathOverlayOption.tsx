import {default as Button } from "@IFS/UI/components/button";

import { I_buttonInput } from "@IFS/types/UI";
import { I_session, PathOption } from "@IFS/types/state";
import SessionMutation from "@IFS/execution/sessionMutation";
import { pathDrawThreshold } from "@IFS/resources/globalConstants"
import { useContext, useEffect, useState } from "react";
import { Ctx } from "@IFS/UI/SharedUIState";
import { PathOptions } from "@IFS/resources/globalConstants"
import styles from "../../components/inputs.module.css"

const PathOverlayControls = ({session}: {session: I_session}) => {

  const {ctx, setCtx} = useContext(Ctx)
  const [choice, setChoice] = useState<PathOption>(session.state.options.path)

  const specs: I_buttonInput[] = PathOptions.map(option => { return {

    key: option,
    label: option,

    effect: s => { return new SessionMutation({ using: s, do: s => {

      const newVal =
        (s.state.options.animationRate < pathDrawThreshold ? option : 'None')

      setChoice(newVal); s.state.options.path = newVal;
      setCtx({...ctx, path: newVal});
      return s;

    }, queue: _ => [["ERASE", ["pathOverlay"]]]})}};

  });

  useEffect(() => {
    setChoice(ctx.path);
  }, [ctx]);

  const getClass = (key: string): string => {
    let style = choice == key ?
      styles.active
      : ctx.pathDisabled ?
        styles.disabled
        : styles.inactive

    return style;
  }

  return (
    <span style={{ whiteSpace: "nowrap", display: "flex", alignItems: "center"}}>

      Path:&nbsp; {specs.map(spec => (
        <Button
          classes={getClass(spec.key)}
          key={spec.key}
          spec={spec}
          session={session}
        />
        ))}

    </span>)
}

export default PathOverlayControls;
