import { Injectable } from "@nestjs/common";
import type { ActivityStreamPoint, ActivitySummary } from "@stride-x/domain-types";
import { eventTopics } from "@stride-x/eventing";
import { DomainEventBus } from "../../platform/domain-event-bus.service";
import { createId } from "../../platform/id";
import { InMemoryDb } from "../../platform/in-memory-db.service";

type CreateActivityInput = Partial<ActivitySummary> & {
  distance?: number;
  duration?: number;
  streams?: IncomingActivityStreamPoint[];
};

type IncomingActivityStreamPoint = Pick<ActivityStreamPoint, "lat" | "lng"> &
  Partial<Omit<ActivityStreamPoint, "lat" | "lng" | "ts">> & {
    timestamp?: string;
    ts?: string;
  };

@Injectable()
export class ActivitiesService {
  constructor(
    private readonly db: InMemoryDb,
    private readonly eventBus: DomainEventBus
  ) {}

  list() {
    return this.db.activities;
  }

  findOne(id: string) {
    return this.db.activities.find((activity) => activity.id === id) ?? null;
  }

  create(input: CreateActivityInput) {
    const distanceMeters = input.distanceMeters ?? input.distance ?? 0;
    const movingTimeSeconds = input.movingTimeSeconds ?? input.duration ?? 0;
    const averageSpeedMps = input.averageSpeedMps ?? (movingTimeSeconds > 0 ? distanceMeters / movingTimeSeconds : 0);

    const activity: ActivitySummary = {
      id: createId("act"),
      userId: input.userId ?? "user_demo",
      type: input.type ?? "run",
      startedAt: input.startedAt ?? new Date().toISOString(),
      endedAt: input.endedAt ?? new Date().toISOString(),
      timezone: input.timezone ?? "Asia/Kolkata",
      title: input.title ?? "Untitled workout",
      description: input.description,
      distanceMeters,
      movingTimeSeconds,
      elapsedTimeSeconds: input.elapsedTimeSeconds ?? movingTimeSeconds,
      elevationGainMeters: input.elevationGainMeters ?? 0,
      averagePaceSecondsPerKm: input.averagePaceSecondsPerKm ?? (distanceMeters > 0 ? movingTimeSeconds / (distanceMeters / 1000) : undefined),
      averageSpeedMps,
      averageHeartRate: input.averageHeartRate,
      maxHeartRate: input.maxHeartRate,
      averageCadence: input.averageCadence,
      averagePowerWatts: input.averagePowerWatts,
      calories: input.calories,
      visibility: input.visibility ?? "followers",
      routeId: input.routeId,
      mediaCount: input.mediaCount ?? 0
    };

    this.db.activities.push(activity);
    if (input.streams?.length) {
      this.storeStreams(activity.id, input.streams);
    }

    this.eventBus.emit("activity.created", activity);
    this.eventBus.emit(eventTopics.activityCompleted, {
      activity,
      triggeredAt: new Date().toISOString(),
      source: "mobile_sync"
    });
    return activity;
  }

  storeStreams(activityId: string, points: IncomingActivityStreamPoint[]) {
    const normalized = points.map((point) => this.normalizeStreamPoint(point));
    const existing = this.db.activityStreams.get(activityId) ?? [];
    const merged = [...existing, ...normalized].sort((a, b) => a.ts.localeCompare(b.ts));
    this.db.activityStreams.set(activityId, merged);
    this.eventBus.emit("activity.streams.stored", { activityId, count: normalized.length });
    this.eventBus.emit(eventTopics.activityStreamsStored, {
      activityId,
      count: normalized.length,
      triggeredAt: new Date().toISOString()
    });
    return { accepted: normalized.length };
  }

  getStreams(activityId: string) {
    return {
      activityId,
      streams: (this.db.activityStreams.get(activityId) ?? []).map((point) => ({
        lat: point.lat,
        lng: point.lng,
        timestamp: point.ts,
        elevationMeters: point.elevationMeters,
        heartRate: point.heartRate,
        cadence: point.cadence,
        powerWatts: point.powerWatts
      }))
    };
  }

  private normalizeStreamPoint(point: IncomingActivityStreamPoint): ActivityStreamPoint {
    return {
      ...point,
      ts: point.ts ?? point.timestamp ?? new Date().toISOString()
    };
  }
}
