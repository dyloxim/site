import { I_session } from '@IFS/types/state';
import { default as Function } from './function';

const Panel = ({session}: {session: I_session}) => {

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
        {session.settings.FS.transforms.map((f, i) => {
          return (<Function session={session} key={i} k={i}/>)
        })}
      </div>
      <br/>
    </>
  );
}

export default Panel;
