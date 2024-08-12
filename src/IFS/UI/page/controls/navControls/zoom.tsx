import { default as Button } from "@IFS/UI/components/button";
import { default as SessionMutation } from "@IFS/execution/sessionMutation";
import { I_buttonInput } from "@IFS/types/UI"

import * as Globals from "@IFS/resources/globalConstants";
import { I_session } from "@IFS/types";

export default function ZoomControl({session}: {session: I_session}) {

  const steppers: I_buttonInput[] = [

    { identifier: '+', value: Globals.incrementUnit },
    { identifier: '-', value: 1 / Globals.incrementUnit }

  ]. map (option => { return {

    key: option.identifier == '+' ? 'viewTowards' : 'viewAway',
    label: option.identifier,
    effect: s => { return new SessionMutation({ using: s, do: s => {

        let newDisplayRadius = s.settings.display.domain.displayRadius * option.value;
        s.settings.display.domain.displayRadius = newDisplayRadius;
        return s;

      }, queue: _ => ["RELOAD:rig", "REVIEW:controlPoints"] })

    }}});
      

  return (<> {steppers.map(spec => (<Button session={session} spec={spec}/>))} </>)
}
