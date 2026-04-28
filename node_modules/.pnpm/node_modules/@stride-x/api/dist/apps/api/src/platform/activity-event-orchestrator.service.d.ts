import { OnModuleInit } from "@nestjs/common";
import { DomainEventBus } from "./domain-event-bus.service";
import { InMemoryDb } from "./in-memory-db.service";
export declare class ActivityEventOrchestrator implements OnModuleInit {
    private readonly eventBus;
    private readonly db;
    constructor(eventBus: DomainEventBus, db: InMemoryDb);
    onModuleInit(): void;
    private buildAffectedScopes;
    private findActivity;
    private findAthlete;
    private validateActivity;
    private upsertLeaderboardEntry;
    private pushFeed;
    private distanceMeters;
    private toRadians;
}
//# sourceMappingURL=activity-event-orchestrator.service.d.ts.map