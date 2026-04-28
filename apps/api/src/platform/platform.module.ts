import { Global, Module } from "@nestjs/common";
import { ActivityEventOrchestrator } from "./activity-event-orchestrator.service";
import { DomainEventBus } from "./domain-event-bus.service";
import { InMemoryDb } from "./in-memory-db.service";

@Global()
@Module({
  providers: [InMemoryDb, DomainEventBus, ActivityEventOrchestrator],
  exports: [InMemoryDb, DomainEventBus, ActivityEventOrchestrator]
})
export class PlatformModule {}

