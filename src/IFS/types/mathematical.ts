
export interface I_translation {
  translation: number[]
}

export interface I_linear {
  linear: number[][]
}

export interface I_affine {
  linear: number[][],
  translation: number[]
}

export type I_transform = I_translation | I_linear | I_affine
