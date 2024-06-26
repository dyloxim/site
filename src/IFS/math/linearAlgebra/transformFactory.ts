import { I_transform, I_affine, I_linear, I_translation } from "@IFS/types";
import Transform from "./transform";
import Affine from "./affine";
import Trans2 from "./trans2";
import Lin2x2 from "./lin2x2";

export default class TransformFactory {

  static isTranslation = (t: I_transform): t is I_translation => {
    return ( t.hasOwnProperty('translation') && !t.hasOwnProperty('linear') )
  }

  static isLinear = (t: I_transform): t is I_linear => {
    return ( t.hasOwnProperty('linear') && !t.hasOwnProperty('translation') )
  }

  // private static isAffine = (t: I_transform): t is I_affine => {
  //   return (
  //     (typeof (t as I_affine).translation !== undefined) &&
  //       (typeof (t as I_affine).linear    !== undefined)
  //   )
  // }

  static getInstance(t: I_transform): Transform {
    if (TransformFactory.isTranslation(t)) return new Trans2(...t.translation) as any;
    else if (TransformFactory.isLinear(t)) return new Lin2x2(...t.linear) as any;
    return new Affine(t["linear"], t["translation"]) as any;
  }
  
}
