import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import type { IntegrationConnection } from "@stride-x/domain-types";
import { IntegrationsService } from "./integrations.service";

@Controller("integrations")
export class IntegrationsController {
  constructor(private readonly integrationsService: IntegrationsService) {}

  @Get(":userId")
  list(@Param("userId") userId: string) {
    return { data: this.integrationsService.list(userId) };
  }

  @Post()
  connect(
    @Body()
    body: Pick<IntegrationConnection, "userId" | "provider" | "scopes">
  ) {
    return { data: this.integrationsService.connect(body) };
  }
}

