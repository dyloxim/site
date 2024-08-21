import { I_selectInput } from "@IFS/types/UI";
import { default as Select } from "@IFS/UI/components/select";

import { default as SessionMutation } from "@IFS/execution/sessionMutation";

import { NamedFSPreset } from "@IFS/types/specifications";
import { NamedFSPresets } from "@IFS/resources/globalConstants";
import { FunctionSystems } from "@IFS/resources/presets/FSPresets";
import { useContext } from "react";
import { Ctx } from "@IFS/UI/SharedUIState";
import { I_session } from "@IFS/types/state";


const PresetControls = ({session}: {session: I_session}) => {

  const {ctx, setCtx} = useContext(Ctx)

  const spec: I_selectInput = {

    label: "Preset",
    key: "presetSelect",
    initial: session.settings.FS.name,

    options: NamedFSPresets.toSorted().map(optionKey => { let preset = FunctionSystems[optionKey as NamedFSPreset];

      return {
        key: preset.key,
        label: preset.name,
        effect: s => { return new SessionMutation({ using: s, do: s => {

          s.settings.FS = preset;
          setCtx({...ctx, FS: preset.transforms })
          return s;

        }, queue: _ => [

          "RELOAD:FS",
          "DO:clearSelection",
          "DO:revertRigToInitial",

        ]})}
      }})

  }

  return (<> <Select spec={spec} session={session}/> </>)
}

export default PresetControls;
