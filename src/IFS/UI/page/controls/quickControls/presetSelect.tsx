import { I_selectInput } from "@IFS/types/UI";
import { default as Select } from "@IFS/UI/components/select";

import { default as SessionMutation } from "@IFS/execution/sessionMutation";

import { NamedFSPreset } from "@IFS/types/specifications";
import { NamedFSPresets } from "@IFS/resources/globalConstants";
import { FunctionSystems } from "@IFS/resources/presets/FSPresets";
import { useContext } from "react";
import { SharedUIState } from "@IFS/UI/SharedUIState";


export default function PresetControls() {

  const {session} = useContext(SharedUIState)

  const spec: I_selectInput = {

    label: "Preset",
    key: "presetSelect",
    initial: session.settings.FS.key,

    options: NamedFSPresets.map(optionKey => { let preset = FunctionSystems[optionKey as NamedFSPreset];

      return {
        key: preset.key,
        label: preset.name,
        effect: s => { return new SessionMutation({ using: s, do: s => {

          s.settings.FS = preset;
          console.log(s);
          return s;

        }, queue: _ => [

          "RELOAD:rig",
          "RELOAD:FS",
          "DO:clearSelection",
          "DO:revertRigToInitial",

        ]})}
      }})

  }

  return (<> <Select spec={spec}/> </>)
}
