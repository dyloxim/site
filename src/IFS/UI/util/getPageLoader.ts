import { SetupInputs } from "@IFS/types/UI";
import setupApp from "./setupApp";

const getPageLoader = (inputs: SetupInputs) => {

  return () => {
    setupApp(inputs);
    window.addEventListener('resize', _ => {
      inputs.resizeFn(inputs.container, inputs.session)
    })
  }

}

export default getPageLoader;
