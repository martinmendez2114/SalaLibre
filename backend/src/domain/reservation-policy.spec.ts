import { describe, expect, it } from "vitest";
import { evaluateReservation, rangesOverlap, TimeRange } from "./reservation-policy";


const hora = (h: number, m = 0): Date => new Date(Date.UTC(2026, 10, 12, h, m));
const rango = (inicio: number, fin: number): TimeRange => ({
  start: hora(inicio),
  end: hora(fin),
});

describe("rangesOverlap", () => {
  it("permite reservas consecutivas (una termina cuando empieza la otra)", () => {
    expect(rangesOverlap(rango(8, 10), rango(10, 12))).toBe(false);
    expect(rangesOverlap(rango(10, 12), rango(8, 10))).toBe(false);
  });

  it("permite rangos completamente separados", () => {
    expect(rangesOverlap(rango(8, 9), rango(14, 15))).toBe(false);
  });

  it("detecta cuando una reserva empieza dentro de otra", () => {
    expect(rangesOverlap(rango(8, 10), rango(9, 11))).toBe(true);
  });

  it("detecta cuando una reserva termina dentro de otra", () => {
    expect(rangesOverlap(rango(9, 11), rango(8, 10))).toBe(true);
  });

  it("detecta cuando una reserva contiene a la otra", () => {
    expect(rangesOverlap(rango(8, 12), rango(9, 10))).toBe(true);
    expect(rangesOverlap(rango(9, 10), rango(8, 12))).toBe(true);
  });

  it("detecta rangos idénticos", 
    () => {
    expect(rangesOverlap(rango(8, 10), rango(8, 10))).toBe(true);
  });
});
describe("evaluateReservation", () => {
  const AHORA = new Date(Date.UTC(2026, 10, 11, 12));
  const aprobadas = [rango(8, 10)];

  it("acepta una reserva válida sin cruces", () => {
    expect(evaluateReservation(rango(14, 16), aprobadas, AHORA)).toEqual({ ok: true });
  });

  it("acepta una reserva pegada a otra aprobada", () => {
    expect(evaluateReservation(rango(10, 12), aprobadas, AHORA)).toEqual({ ok: true });
  });

  it("rechaza si el fin no es posterior al inicio", () => {
    const r = { start: hora(14), end: hora(14) };
    expect(evaluateReservation(r, aprobadas, AHORA)).toEqual({ ok: false, reason: "INVALID_RANGE" });
  });

  it("rechaza reservas en el pasado", () => {
    const ahora = hora(9);
    expect(evaluateReservation(rango(8, 10), [], ahora)).toEqual({ ok: false, reason: "IN_THE_PAST" });
  });

  it("rechaza reservas de menos de 30 minutos", () => {
    const r = { start: hora(14), end: hora(14, 15) };
    expect(evaluateReservation(r, aprobadas, AHORA)).toEqual({ ok: false, reason: "TOO_SHORT" });
  });

  it("rechaza reservas de más de 4 horas", () => {
    expect(evaluateReservation(rango(14, 19), aprobadas, AHORA)).toEqual({ ok: false, reason: "TOO_LONG" });
  });

  it("rechaza si se cruza con una reserva aprobada", () => {
    expect(evaluateReservation(rango(9, 11), aprobadas, AHORA)).toEqual({ ok: false, reason: "OVERLAP" });
  });
});