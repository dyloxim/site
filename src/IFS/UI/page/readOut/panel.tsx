import { useContext, useEffect, useState } from "react";
import { default as Function } from './function';
import { Ctx } from '@IFS/UI/SharedUIState';
import { I_transform } from "@IFS/types/mathematical";
import { I_session } from "@IFS/types/state";


const Panel = ({session}: {session: I_session}) => {

  const {ctx} = useContext(Ctx);

  const [transforms, setTransforms] = useState<I_transform[]>(
    session.settings.FS.transforms
  );

  useEffect(() => {
    if(session.state.options.path == ctx.path) {
      setTransforms(session.settings.FS.transforms);
      if (session.state.inputSelected) {
        document.getElementById(`${session.state.inputSelected}`)!.focus()
      }
    }
  }, [ctx])

  return (
    <div style={{padding: ".5em", backgroundColor: "#121213", marginTop: "1em"}}>
      <pre style={{ color: "#b2b2b4", paddingLeft: ".5em"}}>Transforms:</pre>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          gap: "1em",
          marginRight: "1em",
          marginLeft: "1em",
          marginTop: "1.5em"
        }}>
        {transforms.map((f, i) => {
          return (<Function key={i} f={f} k={i} session={session}/>)
        })}
      </div>
      <br/>
    </div>
  );
}

export default Panel;
