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
export const MIN_MINUTES = 30;
export const MAX_MINUTES = 240;

export type RejectionReason =
  | "INVALID_RANGE"
  | "IN_THE_PAST"
  | "TOO_SHORT"
  | "TOO_LONG"
  | "OVERLAP";

export type Decision = { ok: true } | { ok: false; reason: RejectionReason };

/**
 * Decide si una solicitud de reserva es aceptable.
 * Es una función pura: recibe todo lo que necesita (incluida la hora
 * actual) y no toca la base de datos, por eso se prueba sin infraestructura.
 */
export function evaluateReservation(
  request: TimeRange,
  approved: TimeRange[],
  now: Date,
): Decision {
  if (!(request.start < request.end)) {
    return { ok: false, reason: "INVALID_RANGE" };
  }
  if (request.start < now) {
    return { ok: false, reason: "IN_THE_PAST" };
  }
  const minutes = (request.end.getTime() - request.start.getTime()) / 60000;
  if (minutes < MIN_MINUTES) {
    return { ok: false, reason: "TOO_SHORT" };
  }
  if (minutes > MAX_MINUTES) {
    return { ok: false, reason: "TOO_LONG" };
  }
  if (approved.some((existing) => rangesOverlap(existing, request))) {
    return { ok: false, reason: "OVERLAP" };
  }
  return { ok: true };
}