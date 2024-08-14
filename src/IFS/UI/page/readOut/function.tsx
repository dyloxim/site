import { I_numberInput } from "@IFS/types/UI";
import { default as SessionMutation } from "@IFS/execution/sessionMutation"
import { I_affine, I_linear } from "@IFS/types/mathematical"
import { SharedUIState } from '@IFS/UI/SharedUIState';
import { useContext, useEffect } from "react";
import { default as NumberInput } from "@IFS/UI/components/number";
import { I_session } from "@IFS/types/state";
import { v4 } from "uuid";


const Function = ({session, k}: {session: I_session, k: number}) => {

  const {ctx, setCtx} = useContext(SharedUIState);

  let linear = (ctx.FS[k] as I_linear).linear;
  let translation = (ctx.FS[k] as I_affine).translation ?
    (ctx.FS[k] as I_affine).translation : [0,0]

  useEffect(() => {
    if (session.state.inputSelected) {
      document.getElementById(`${session.state.inputSelected}`)!.focus()
    }
  }, [ctx])

  type linearId = [number, "linear", [number, number]];
  type translationId = [number, "translation", number];
  const isLinearId = (p: linearId | translationId): p is linearId => (p[1] == "linear");

  const getSpec = (
    coeff: number,
    id: linearId | translationId
  ): I_numberInput => {
    return {
      key: `${id}`,
      label: '',
      initial: coeff,
      effect: (e, s) => { return new SessionMutation({ using: s, do: s => {
        
        if (isLinearId(id)) {

          (s.settings.FS.transforms[id[0]] as I_linear).linear[id[2][0]][id[2][1]] = Number(e.target.value);
          (ctx.FS[id[0]] as I_linear).linear[id[2][0]][id[2][1]] = Number(e.target.value);
          s.state.selected = [id[0]];
          s.state.inputSelected = id;
          setCtx({...ctx});

        } else {

          translation[id[2]] = Number(e.target.value);
          ctx.FS[id[0]] = {
            linear: linear,
            translation: translation
          }
          s.state.selected = [];
          s.state.inputSelected = id;
          setCtx({...ctx});

        }
        s.state.options.controlPointsShown = true;
        s.state.tacit.pendingRerender = true;
        return s;

      }, queue: _ => [

        "REVIEW:controlPoints",
        "RELOAD:FS",

      ]})
      }
    }
  }

  return (
    <>
      <div
        style={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "flex-start",
        gap: ".5em"
      }}>
        <pre>f<sub>{k+1}</sub> = </pre>

        <div className="mat">
          <div style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
          }}>
            {linear.map((row, i) => {
              return (
                <div
                  key={v4()}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    flexWrap: "wrap",
                    gap: ".5em"
                  }}>
                  {row.map((coeff, j) => {
                    return (
                      <NumberInput
                        key={v4()}
                        session={session}
                        spec={getSpec(coeff, [k, "linear", [i, j]])}/>
                    );
                  })}
                </div>
              )})}
          </div>
        </div>

        <pre> + </pre>


        <div className="mat">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flexWrap: "wrap",
              gap: ".5em"
            }}>
            {translation.map((coeff, i) => {
              return (
                <NumberInput
                  key={v4()}
                  session={session}
                  spec={getSpec(coeff, [k, "translation", i])}/>
              )})}
          </div>
        </div>
      </div>
    </>
  )
}

export default Function;
