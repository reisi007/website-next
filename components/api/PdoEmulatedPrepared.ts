export type PdoEmulatedPrepared<T> =
  T extends (infer E)[] ? Array<PdoEmulatedPrepared<E>> : (
    T extends object ? {
      [Key in keyof T]: PdoEmulatedPrepared<T[Key]>
    } : MapPrimitive<T>
  );

type MapPrimitive<T> =
  T extends boolean ? MapKeepOptional<T, '0' | '1'> :
    (
      T extends number ? `${number}` : MapKeepOptional<T, string>
    );

type MapKeepOptional<Source, Target> = Source extends undefined ? Target | undefined : (
  Source extends null ? Target | null : Target);
