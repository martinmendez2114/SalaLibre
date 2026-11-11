import { describe, expect, it } from "vitest";
import { rangesOverlap, TimeRange } from "./reservation-policy";

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