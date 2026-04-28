import type { ActivityStreamPoint, ActivitySummary } from "@stride-x/domain-types";
import { DomainEventBus } from "../../platform/domain-event-bus.service";
import { InMemoryDb } from "../../platform/in-memory-db.service";
type CreateActivityInput = Partial<ActivitySummary> & {
    distance?: number;
    duration?: number;
    streams?: IncomingActivityStreamPoint[];
};
type IncomingActivityStreamPoint = Pick<ActivityStreamPoint, "lat" | "lng"> & Partial<Omit<ActivityStreamPoint, "lat" | "lng" | "ts">> & {
    timestamp?: string;
    ts?: string;
};
export declare class ActivitiesService {
    private readonly db;
    private readonly eventBus;
    constructor(db: InMemoryDb, eventBus: DomainEventBus);
    list(): ActivitySummary[];
    findOne(id: string): ActivitySummary;
    create(input: CreateActivityInput): ActivitySummary;
    storeStreams(activityId: string, points: IncomingActivityStreamPoint[]): {
        accepted: number;
    };
    getStreams(activityId: string): {
        activityId: string;
        streams: {
            lat: number;
            lng: number;
            timestamp: string;
            elevationMeters: number;
            heartRate: number;
            cadence: number;
            powerWatts: number;
        }[];
    };
    private normalizeStreamPoint;
}
export {};
//# sourceMappingURL=activities.service.d.ts.map