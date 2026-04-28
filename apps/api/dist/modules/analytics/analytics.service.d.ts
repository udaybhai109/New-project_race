import { ActivitiesService } from "../activities/activities.service";
export declare class AnalyticsService {
    private readonly activitiesService;
    constructor(activitiesService: ActivitiesService);
    trainingInsights(athleteId: string): import("@stride-x/domain-types").AnalyticsInsight[];
}
//# sourceMappingURL=analytics.service.d.ts.map