import { I_session } from '@IFS/types/state';
import { default as Function } from './function';

const Panel = ({session}: {session: I_session}) => {

  return (
    <>
      <pre>Transforms:</pre>
      {session.settings.FS.transforms.map((f, i) => {
        return (<Function key={i} f={f}/>)
      })}
    </>
  );
}

export default Panel;
