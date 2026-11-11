export interface TimeRange {
  start: Date;
  end: Date;
}
/**
 * Dos rangos se cruzan si cada uno empieza antes de que el otro termine.
 * Los rangos son semiabiertos [start, end): si uno termina justo
 * cuando el otro empieza, NO hay cruce.
 */
export function rangesOverlap(a: TimeRange, b: TimeRange): boolean {
  return a.start < b.end && b.start < a.end;
}