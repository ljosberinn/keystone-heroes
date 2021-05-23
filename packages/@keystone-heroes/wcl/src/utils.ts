export const isValidReportId = (id?: string | string[]): id is string =>
  !Array.isArray(id) && id?.length === 16 && !id.includes(".");

export const ONGOING_REPORT_THRESHOLD = 24 * 60 * 60 * 1000;

/**
 * assume a report may still be ongoing if its less than one day old
 */
export const maybeOngoingReport = (endTime: number): boolean =>
  ONGOING_REPORT_THRESHOLD > Date.now() - endTime;

// https://github.com/krzkaczor/ts-essentials/blob/master/lib/types.ts#L99
export type DeepNonNullable<T> = T extends
  | (string | number | boolean | bigint | symbol | undefined | null)
  // eslint-disable-next-line @typescript-eslint/ban-types
  | Function
  | Date
  | Error
  | RegExp
  ? NonNullable<T>
  : T extends Map<infer K, infer V>
  ? Map<DeepNonNullable<K>, DeepNonNullable<V>>
  : T extends ReadonlyMap<infer K, infer V>
  ? ReadonlyMap<DeepNonNullable<K>, DeepNonNullable<V>>
  : T extends WeakMap<infer K, infer V>
  ? WeakMap<DeepNonNullable<K>, DeepNonNullable<V>>
  : T extends Set<infer U>
  ? Set<DeepNonNullable<U>>
  : T extends ReadonlySet<infer U>
  ? ReadonlySet<DeepNonNullable<U>>
  : T extends WeakSet<infer U>
  ? WeakSet<DeepNonNullable<U>>
  : T extends Promise<infer U>
  ? Promise<DeepNonNullable<U>>
  : T extends {}
  ? { [K in keyof T]: DeepNonNullable<T[K]> }
  : NonNullable<T>;
