import {default as Button } from "@IFS/UI/inputTypes/button";

import { I_UIContext, I_buttonInput } from "@IFS/types/UI";
import SessionMutation from "@IFS/execution/sessionMutation";

const PathOverlayControls = ({ctx}: {ctx: I_UIContext}) => {

  const specs: I_buttonInput[] = [

    { key: "noPath", label: 'Never', value: null },
    { key: "showRecentPaths", label: 'Recent', value: "recent" },
    { key: "persistPaths", label: 'All', value: "persist" },

  ].map(option => {

    return {

      key: option.key,
      label: option.label,
      effect: s => { return new SessionMutation({ using: s, do: s => {


        const newVal = option.value as null | "recent" | "persist";
        s.state.options.path = newVal;
        return s;

      }, queue: _ => option.value ? [] : [["ERASE", ["pathOverlay"]]]

      })}} as I_buttonInput

  });

  return (
    <>

      Path: {specs.map(spec => (
        <Button ctx={ctx} spec={spec}/>
      ))} &nbsp;

    </>)
}

export default PathOverlayControls;
