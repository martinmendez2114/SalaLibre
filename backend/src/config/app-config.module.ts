import { Global, Module } from "@nestjs/common";
import { AppEnv, parseEnv } from "./app-env";

export const APP_ENV = "APP_ENV";

@Global()
@Module({
  providers: [{ provide: APP_ENV, useFactory: (): AppEnv => parseEnv(process.env) }],
  exports: [APP_ENV],
})
export class AppConfigModule {}