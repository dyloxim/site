
export type PrependIfDefined<T extends string, S extends string> = T extends "" ? T : `${S}${T}`;

export type ConcatS<T extends string[], S extends string> = T extends [
    infer F extends string,
    ...infer R extends string[]
  ] ? `${F}${PrependIfDefined<ConcatS<R, S>, S>}` : '';

export function joinWithSeparator<S extends string>(separator: S) {
    return function <T extends string[]>(...strings: T): ConcatS<T, S> {
        return strings.join(separator) as ConcatS<T, S>;
    }
}
