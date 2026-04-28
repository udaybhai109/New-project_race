import { Module } from "@nestjs/common";
import { ActivitiesModule } from "../activities/activities.module";
import { AnalyticsService } from "./analytics.service";

@Module({
  imports: [ActivitiesModule],
  providers: [AnalyticsService],
  exports: [AnalyticsService]
})
export class AnalyticsModule {}

