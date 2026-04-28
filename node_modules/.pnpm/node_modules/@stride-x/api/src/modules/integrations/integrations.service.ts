import { Injectable } from "@nestjs/common";
import type { IntegrationConnection } from "@stride-x/domain-types";
import { eventTopics } from "@stride-x/eventing";
import { DomainEventBus } from "../../platform/domain-event-bus.service";
import { createId } from "../../platform/id";
import { InMemoryDb } from "../../platform/in-memory-db.service";

@Injectable()
export class IntegrationsService {
  constructor(
    private readonly db: InMemoryDb,
    private readonly eventBus: DomainEventBus
  ) {}

  list(userId: string) {
    return this.db.integrations.filter((connection) => connection.userId === userId);
  }

  connect(input: Pick<IntegrationConnection, "userId" | "provider" | "scopes">) {
    const connection: IntegrationConnection = {
      id: createId("int"),
      userId: input.userId,
      provider: input.provider,
      status: "active",
      scopes: input.scopes,
      connectedAt: new Date().toISOString(),
      lastSyncedAt: new Date().toISOString()
    };

    this.db.integrations.push(connection);
    this.eventBus.emit(eventTopics.integrationConnected, {
      connection,
      triggeredAt: new Date().toISOString()
    });
    return connection;
  }
}
