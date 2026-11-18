export interface AppEnv {
  databaseUrl: string;
  jwtSecret: string;
  jwtExpiresIn: string;
  appVersion: string;
  port: number;
}

/**
 * Lee y valida la configuración. Falla al arrancar con un mensaje claro
 * en lugar de descubrir un valor faltante en mitad de una petición.
 */
export function parseEnv(source: NodeJS.ProcessEnv): AppEnv {
  const errors: string[] = [];

  const databaseUrl = source.DATABASE_URL ?? "";
  if (!/^postgres(ql)?:\/\//.test(databaseUrl)) {
    errors.push("DATABASE_URL debe ser una URL de PostgreSQL");
  }

  const jwtSecret = source.JWT_SECRET ?? "";
  if (jwtSecret.length < 32) {
    errors.push("JWT_SECRET debe tener al menos 32 caracteres");
  }

  const port = Number(source.PORT ?? 3000);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    errors.push("PORT debe ser un entero entre 1 y 65535");
  }

  if (errors.length > 0) {
    throw new Error(`Configuración inválida:\n- ${errors.join("\n- ")}`);
  }

  return {
    databaseUrl,
    jwtSecret,
    jwtExpiresIn: source.JWT_EXPIRES_IN ?? "8h",
    appVersion: source.APP_VERSION ?? "dev",
    port,
  };
}