import type { IntegrationConnection } from "@stride-x/domain-types";
import { DomainEventBus } from "../../platform/domain-event-bus.service";
import { InMemoryDb } from "../../platform/in-memory-db.service";
export declare class IntegrationsService {
    private readonly db;
    private readonly eventBus;
    constructor(db: InMemoryDb, eventBus: DomainEventBus);
    list(userId: string): IntegrationConnection[];
    connect(input: Pick<IntegrationConnection, "userId" | "provider" | "scopes">): IntegrationConnection;
}
//# sourceMappingURL=integrations.service.d.ts.map