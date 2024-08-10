import { I_selectInput } from "@IFS/types/UI";
import { I_UIContext } from "@IFS/types/UI"

import { default as Select } from "@IFS/UI/inputTypes/select";
import { default as SessionMutation } from "@IFS/execution/sessionMutation";

import { NamedFSPreset } from "@IFS/types/specifications";
import { NamedFSPresets } from "@IFS/resources/globalConstants";
import { FunctionSystems } from "@IFS/resources/presets/FSPresets";


export default function PresetControls({ctx}: {ctx: I_UIContext}) {

  const spec: I_selectInput = {

    mainLabel: "Preset",
    mainKey: "presetSelect",
    initial: ctx.session.settings.FS.name,

    options: NamedFSPresets.map(presetKey => {

      let preset = FunctionSystems[presetKey as NamedFSPreset];
      return { key: presetKey, label: preset.name }

    }),

    effect: (option, s) => { return new SessionMutation({ using: s, do: s => {

      s.settings.FS = FunctionSystems[option as NamedFSPreset];
      return s;

    }, queue: _ => [

      "DO:clearSelection", "DO:revertRigToInitial", "RELOAD:FS", "RELOAD:rig",

    ]})}

  }

  return (
    <>
      <Select ctx={ctx} spec={spec}/>
    </>
  )
}
