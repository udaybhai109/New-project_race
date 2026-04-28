import type { ActivityStreamPoint, ActivitySummary } from "@stride-x/domain-types";
import { ActivitiesService } from "./activities.service";
type CreateActivityRequest = Partial<ActivitySummary> & {
    userId: string;
    distance?: number;
    duration?: number;
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
        points: ActivityStreamPoint[];
    }): {
        data: {
            accepted: number;
        };
    };
    sync(body: {
        summary: Partial<ActivitySummary>;
        points: ActivityStreamPoint[];
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