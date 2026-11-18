import { NestFactory } from "@nestjs/core";
import helmet from "helmet";
import { AppModule } from "./app.module";
import { AppEnv } from "./config/app-env";
import { APP_ENV } from "./config/app-config.module";

async function bootstrap(): Promise<void> {
  // En producción las variables las inyecta Docker; el .env es solo para desarrollo.
  if (process.env.NODE_ENV !== "production") {
    try {
      process.loadEnvFile();
    } catch {
      // sin archivo .env: se usan las variables del entorno
    }
  }

  const app = await NestFactory.create(AppModule);
  const env = app.get<AppEnv>(APP_ENV);

  app.setGlobalPrefix("api");
  app.use(helmet());
  app.enableShutdownHooks();

  await app.listen(env.port);
}

void bootstrap();