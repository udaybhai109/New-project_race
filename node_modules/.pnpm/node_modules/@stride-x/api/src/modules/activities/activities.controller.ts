import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import type { ActivityStreamPoint, ActivitySummary } from "@stride-x/domain-types";
import { ActivitiesService } from "./activities.service";

type CreateActivityRequest = Partial<ActivitySummary> & {
  userId: string;
  distance?: number;
  duration?: number;
  streams?: IncomingActivityStreamPoint[];
};

type IncomingActivityStreamPoint = Pick<ActivityStreamPoint, "lat" | "lng"> &
  Partial<Omit<ActivityStreamPoint, "lat" | "lng" | "ts">> & {
    timestamp?: string;
    ts?: string;
  };

@Controller("activities")
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Get()
  list() {
    return { data: this.activitiesService.list() };
  }

  @Post()
  create(@Body() body: CreateActivityRequest) {
    const activity = this.activitiesService.create(body);
    return {
      success: true,
      activityId: activity.id
    };
  }

  @Post(":id/streams")
  createStreams(@Param("id") id: string, @Body() body: { points?: IncomingActivityStreamPoint[]; streams?: IncomingActivityStreamPoint[] }) {
    return { data: this.activitiesService.storeStreams(id, body.points ?? body.streams ?? []) };
  }

  @Get(":id/streams")
  getStreams(@Param("id") id: string) {
    return this.activitiesService.getStreams(id);
  }

  @Post("sync")
  sync(@Body() body: { summary: Partial<ActivitySummary>; points?: IncomingActivityStreamPoint[]; streams?: IncomingActivityStreamPoint[] }) {
    const activity = this.activitiesService.create(body.summary);
    const accepted = this.activitiesService.storeStreams(activity.id, body.points ?? body.streams ?? []);
    return { data: { activity, accepted } };
  }
}
