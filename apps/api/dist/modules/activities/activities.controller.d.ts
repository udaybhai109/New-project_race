import type { ActivityStreamPoint, ActivitySummary } from "@stride-x/domain-types";
import { ActivitiesService } from "./activities.service";
type CreateActivityRequest = Partial<ActivitySummary> & {
    userId: string;
    distance?: number;
    duration?: number;
    streams?: IncomingActivityStreamPoint[];
};
type IncomingActivityStreamPoint = Pick<ActivityStreamPoint, "lat" | "lng"> & Partial<Omit<ActivityStreamPoint, "lat" | "lng" | "ts">> & {
    timestamp?: string;
    ts?: string;
};
export declare class ActivitiesController {
    private readonly activitiesService;
    constructor(activitiesService: ActivitiesService);
    list(): {
        data: ActivitySummary[];
    };
    create(body: CreateActivityRequest): {
        success: boolean;
        activityId: string;
    };
    createStreams(id: string, body: {
        points?: IncomingActivityStreamPoint[];
        streams?: IncomingActivityStreamPoint[];
    }): {
        data: {
            accepted: number;
        };
    };
    getStreams(id: string): {
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
    sync(body: {
        summary: Partial<ActivitySummary>;
        points?: IncomingActivityStreamPoint[];
        streams?: IncomingActivityStreamPoint[];
    }): {
        data: {
            activity: ActivitySummary;
            accepted: {
                accepted: number;
            };
        };
    };
}
export {};
//# sourceMappingURL=activities.controller.d.ts.map