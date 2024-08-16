import { useContext, useEffect, useState } from "react";
import { default as Function } from './function';
import { SharedUIState } from '@IFS/UI/SharedUIState';
import { I_transform } from "@IFS/types/mathematical";


const Panel = () => {

  const {session} = useContext(SharedUIState);

  const [transforms, setTransforms] = useState<I_transform[]>(
    session.settings.FS.transforms
  );

  useEffect(() => {
    setTransforms(session.settings.FS.transforms);
    if (session.state.inputSelected) {
      document.getElementById(`${session.state.inputSelected}`)!.focus()
    }
  }, [JSON.stringify(session.settings.FS.transforms)])

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
          return (<Function key={i} f={f} k={i}/>)
        })}
      </div>
      <br/>
    </>
  );
}

export default Panel;
