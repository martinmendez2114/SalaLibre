import { describe, expect, it } from "vitest";
import { parseEnv } from "./app-env";

const base = {
  DATABASE_URL: "postgresql://u:p@localhost:5432/db",
  JWT_SECRET: "x".repeat(32),
};

describe("parseEnv", () => {
  it("aplica valores por defecto", () => {
    const env = parseEnv(base);
    expect(env.port).toBe(3000);
    expect(env.jwtExpiresIn).toBe("8h");
    expect(env.appVersion).toBe("dev");
  });

  it("lee la versión desde APP_VERSION", () => {
    expect(parseEnv({ ...base, APP_VERSION: "a1b2c3d" }).appVersion).toBe("a1b2c3d");
  });

  it("rechaza un JWT_SECRET corto", () => {
    expect(() => parseEnv({ ...base, JWT_SECRET: "corto" })).toThrow(/JWT_SECRET/);
  });

  it("rechaza una DATABASE_URL que no es de PostgreSQL", () => {
    expect(() => parseEnv({ ...base, DATABASE_URL: "mysql://x" })).toThrow(/DATABASE_URL/);
  });

  it("rechaza un PORT inválido", () => {
    expect(() => parseEnv({ ...base, PORT: "abc" })).toThrow(/PORT/);
  });
});