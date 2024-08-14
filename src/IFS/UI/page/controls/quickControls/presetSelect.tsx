import { I_selectInput } from "@IFS/types/UI";

import { default as Select } from "@IFS/UI/components/select";
import { default as SessionMutation } from "@IFS/execution/sessionMutation";

import { NamedFSPreset } from "@IFS/types/specifications";
import { NamedFSPresets } from "@IFS/resources/globalConstants";
import { FunctionSystems } from "@IFS/resources/presets/FSPresets";
import { I_session } from "@IFS/types/state";
import { useContext } from "react";
import { SharedUIState } from "@IFS/UI/SharedUIState";




export default function PresetControls({session}: {session: I_session}) {

  const {ctx, setCtx} = useContext(SharedUIState);

  const spec: I_selectInput = {

    mainLabel: "Preset",
    mainKey: "presetSelect",
    initial: session.settings.FS.name,

    options: NamedFSPresets.map(presetKey => {

      let preset = FunctionSystems[presetKey as NamedFSPreset];
      return { key: presetKey, label: preset.name }

    }),

    effect: (option, s) => { return new SessionMutation({ using: s, do: s => {

      s.settings.FS = FunctionSystems[option as NamedFSPreset];
      s.state.tacit.pendingRerender = true;
      setCtx({...ctx, FS: FunctionSystems[option as NamedFSPreset].transforms });
      return s;

    }, queue: _ => [

      "DO:clearSelection",
      "DO:revertRigToInitial",
      "RELOAD:FS",
      "RELOAD:rig",

    ]})}

  }

  return (<> <Select session={session} spec={spec}/> </>)
}
