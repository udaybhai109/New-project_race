import { Injectable } from "@nestjs/common";
import { buildTrendInsight } from "@stride-x/analytics";
import { ActivitiesService } from "../activities/activities.service";

@Injectable()
export class AnalyticsService {
  constructor(private readonly activitiesService: ActivitiesService) {}

  trainingInsights(athleteId: string) {
    return [buildTrendInsight(athleteId, this.activitiesService.list())];
  }
}
