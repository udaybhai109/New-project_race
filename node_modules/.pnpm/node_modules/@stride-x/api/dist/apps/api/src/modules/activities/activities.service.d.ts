import type { ActivityStreamPoint, ActivitySummary } from "@stride-x/domain-types";
import { DomainEventBus } from "../../platform/domain-event-bus.service";
import { InMemoryDb } from "../../platform/in-memory-db.service";
type CreateActivityInput = Partial<ActivitySummary> & {
    distance?: number;
    duration?: number;
};
export declare class ActivitiesService {
    private readonly db;
    private readonly eventBus;
    constructor(db: InMemoryDb, eventBus: DomainEventBus);
    list(): ActivitySummary[];
    findOne(id: string): ActivitySummary;
    create(input: CreateActivityInput): ActivitySummary;
    storeStreams(activityId: string, points: ActivityStreamPoint[]): {
        accepted: number;
    };
}
export {};
//# sourceMappingURL=activities.service.d.ts.map