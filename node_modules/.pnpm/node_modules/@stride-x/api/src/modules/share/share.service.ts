import { Injectable, NotFoundException } from "@nestjs/common";
import { InMemoryDb } from "../../platform/in-memory-db.service";

@Injectable()
export class ShareService {
  constructor(private readonly db: InMemoryDb) {}

  getShare(activityId: string) {
    const existing = this.db.shareBundles.get(activityId);
    if (existing) return existing;

    const activity = this.db.activities.find((item) => item.id === activityId);
    if (!activity) {
      throw new NotFoundException("activity not found");
    }

    return {
      stats: {
        distanceMeters: activity.distanceMeters,
        durationSeconds: activity.movingTimeSeconds,
        averageSpeedMps: activity.averageSpeedMps
      },
      mapPlaceholder: `map://activity/${activityId}`,
      shareText: `I completed ${(activity.distanceMeters / 1000).toFixed(2)} km on Stride X.`
    };
  }
}
