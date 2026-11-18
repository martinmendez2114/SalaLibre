import { Controller, Get, Inject, ServiceUnavailableException } from "@nestjs/common";
import { AppEnv } from "../config/app-env";
import { APP_ENV } from "../config/app-config.module";
import { PrismaService } from "../prisma/prisma.service";

@Controller("health")
export class HealthController {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(APP_ENV) private readonly env: AppEnv,
  ) {}

  @Get()
  async check() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
    } catch {
      throw new ServiceUnavailableException({
        status: "error",
        db: "down",
        version: this.env.appVersion,
      });
    }
    return { status: "ok", db: "ok", version: this.env.appVersion };
  }
}