import Transform from '@IFS/math/linearAlgebra/transform'

export default interface I_FunctionSystem {
  transforms: Transform[],
  weights: number[] | 'uniform'
}
