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
    setTransforms(session.settings.FS.transforms);
    if (session.state.inputSelected) {
      document.getElementById(`${session.state.inputSelected}`)!.focus()
    }
  }, [ctx])

  return (
    <>
      <br/>
      <hr/>
      <pre>Transforms:</pre>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          gap: "2em"
        }}>
        {transforms.map((f, i) => {
          return (<Function key={i} f={f} k={i} session={session}/>)
        })}
      </div>
      <br/>
    </>
  );
}

export default Panel;
