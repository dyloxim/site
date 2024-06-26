import { I_transform } from './I_transform'

export default interface I_FunctionSystem {
  transforms: I_transform[],
  weights: number[] | 'uniform'
}
