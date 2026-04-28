import { Injectable, OnModuleInit } from "@nestjs/common";
import type { ActivitySummary, FeedEntry, LeaderboardEntry, LeaderboardScope } from "@stride-x/domain-types";
import type {
  ActivityCompletedEvent,
  FeedFanoutRequestedEvent,
  IntegrationConnectedEvent,
  LeaderboardUpdateRequestedEvent,
  MediaRequestedEvent,
  ShareRequestedEvent,
  TimingIngestedEvent,
  ValidationRequestedEvent,
  ValidationCompletedEvent
} from "@stride-x/eventing";
import { eventTopics } from "@stride-x/eventing";
import { DomainEventBus } from "./domain-event-bus.service";
import { InMemoryDb } from "./in-memory-db.service";

@Injectable()
export class ActivityEventOrchestrator implements OnModuleInit {
  constructor(
    private readonly eventBus: DomainEventBus,
    private readonly db: InMemoryDb
  ) {}

  onModuleInit() {
    this.eventBus.on<ActivityCompletedEvent>(eventTopics.activityCompleted, ({ activity, triggeredAt }) => {
      const scopes = this.buildAffectedScopes(activity);

      this.eventBus.emit(eventTopics.activityValidationRequested, {
        activityId: activity.id,
        athleteId: activity.userId,
        leaderboardScopes: scopes,
        triggeredAt
      });

    });

    this.eventBus.on<ValidationRequestedEvent>(eventTopics.activityValidationRequested, (payload) => {
      const activity = this.findActivity(payload.activityId);
      const flags = activity ? this.validateActivity(activity) : ["activity_not_found"];
      const verdict = flags.length ? "flagged" : "passed";
      const suspiciousScore = Math.min(100, flags.length * 50);

      console.log(`[VALIDATION] ${verdict}`);

      this.eventBus.emit(eventTopics.activityValidationCompleted, {
        activityId: payload.activityId,
        athleteId: payload.athleteId,
        verdict,
        suspiciousScore,
        flags,
        leaderboardScopes: payload.leaderboardScopes,
        processedAt: new Date().toISOString()
      });
    });

    this.eventBus.on<ValidationCompletedEvent>(eventTopics.activityValidationCompleted, (payload) => {
      this.db.validationVerdicts.push({
        activityId: payload.activityId,
        athleteId: payload.athleteId,
        verdict: payload.verdict,
        suspiciousScore: payload.suspiciousScore,
        flags: payload.flags,
        checkedAt: payload.processedAt
      });

      if (payload.verdict === "passed") {
        this.eventBus.emit(eventTopics.leaderboardUpdateRequested, {
          activityId: payload.activityId,
          athleteId: payload.athleteId,
          scopes: payload.leaderboardScopes,
          triggeredAt: payload.processedAt
        });
      }
    });

    this.eventBus.on<LeaderboardUpdateRequestedEvent>(eventTopics.leaderboardUpdateRequested, (payload) => {
      const activity = this.findActivity(payload.activityId);
      if (!activity) return;

      const athlete = this.findAthlete(payload.athleteId);
      const score = Math.round(activity.distanceMeters);
      const statLabel = `${(activity.distanceMeters / 1000).toFixed(2)} km`;

      payload.scopes.forEach((scope) => this.upsertLeaderboardEntry(scope, {
        scopeId: scope.id,
        athleteId: payload.athleteId,
        athleteName: athlete?.displayName ?? payload.athleteId,
        rank: 0,
        score,
        statLabel,
        updatedAt: new Date().toISOString()
      }));

      console.log("[LEADERBOARD] updated");

      this.eventBus.emit(eventTopics.leaderboardUpdated, {
        activityId: payload.activityId,
        athleteId: payload.athleteId,
        scopes: payload.scopes,
        triggeredAt: new Date().toISOString()
      });

      this.eventBus.emit(eventTopics.feedFanoutRequested, {
        activityId: payload.activityId,
        athleteId: payload.athleteId,
        audienceUserIds: this.db.follows
          .filter((follow) => follow.followeeUserId === payload.athleteId)
          .map((follow) => follow.followerUserId),
        clubIds: this.db.clubMemberships
          .filter((membership) => membership.userId === payload.athleteId)
          .map((membership) => membership.clubId),
        challengeIds: this.db.challengeMemberships
          .filter((membership) => membership.userId === payload.athleteId)
          .map((membership) => membership.challengeId),
        triggeredAt: new Date().toISOString()
      });
    });

    this.eventBus.on<FeedFanoutRequestedEvent>(eventTopics.feedFanoutRequested, (payload) => {
      const now = new Date().toISOString();
      const targets = [payload.athleteId, ...payload.audienceUserIds];

      targets.forEach((userId) => {
        this.pushFeed(userId, {
          id: `feed:${userId}:${payload.activityId}`,
          userId,
          actorId: payload.athleteId,
          type: "activity",
          activityId: payload.activityId,
          createdAt: now
        });
      });

      payload.clubIds.forEach((clubId) => {
        this.pushFeed(`club:${clubId}`, {
          id: `feed:${clubId}:${payload.activityId}`,
          userId: clubId,
          actorId: payload.athleteId,
          type: "club_activity",
          activityId: payload.activityId,
          clubId,
          createdAt: now
        });
      });

      payload.challengeIds.forEach((challengeId) => {
        this.pushFeed(`challenge:${challengeId}`, {
          id: `feed:${challengeId}:${payload.activityId}`,
          userId: challengeId,
          actorId: payload.athleteId,
          type: "challenge_progress",
          activityId: payload.activityId,
          challengeId,
          createdAt: now
        });
      });

      console.log("[FEED] fanout completed");

      this.eventBus.emit(eventTopics.feedFanoutCompleted, {
        activityId: payload.activityId,
        athleteId: payload.athleteId,
        triggeredAt: now
      });

      this.eventBus.emit(eventTopics.mediaRequested, {
        activityId: payload.activityId,
        athleteId: payload.athleteId,
        variants: ["share_card", "route_video", "thumbnail"],
        triggeredAt: now
      });
    });

    this.eventBus.on<MediaRequestedEvent>(eventTopics.mediaRequested, (payload) => {
      console.log("[MEDIA] generated");

      this.eventBus.emit(eventTopics.mediaCompleted, {
        activityId: payload.activityId,
        athleteId: payload.athleteId,
        variants: payload.variants,
        triggeredAt: new Date().toISOString()
      });

      this.eventBus.emit(eventTopics.shareRequested, {
        activityId: payload.activityId,
        athleteId: payload.athleteId,
        platforms: ["instagram", "whatsapp", "facebook", "x", "deep_link"],
        triggeredAt: new Date().toISOString()
      });
    });

    this.eventBus.on<ShareRequestedEvent>(eventTopics.shareRequested, (payload) => {
      const activity = this.findActivity(payload.activityId);
      if (!activity) return;

      const stats = {
        distanceMeters: activity.distanceMeters,
        durationSeconds: activity.movingTimeSeconds,
        averageSpeedMps: activity.averageSpeedMps
      };

      this.db.shareBundles.set(payload.activityId, {
        stats,
        mapPlaceholder: `map://activity/${payload.activityId}`,
        shareText: `I completed ${(activity.distanceMeters / 1000).toFixed(2)} km on Stride X.`
      });

      console.log("[SHARE] generated");

      this.eventBus.emit(eventTopics.shareCompleted, {
        activityId: payload.activityId,
        athleteId: payload.athleteId,
        triggeredAt: new Date().toISOString()
      });
    });

    this.eventBus.on<TimingIngestedEvent>(eventTopics.eventTimingIngested, ({ timing, triggeredAt }) => {
      this.eventBus.emit(eventTopics.leaderboardUpdateRequested, {
        activityId: `${timing.eventId}:${timing.bibNumber}:${timing.checkpointCode}`,
        athleteId: timing.athleteId,
        scopes: [
          {
            id: `event:${timing.eventId}`,
            type: "event",
            label: `Event ${timing.eventId}`,
            eventId: timing.eventId,
            window: "event_live"
          }
        ],
        triggeredAt
      });
    });

    this.eventBus.on<IntegrationConnectedEvent>(eventTopics.integrationConnected, ({ connection, triggeredAt }) => {
      this.eventBus.emit("audit.log", {
        actorId: connection.userId,
        action: "integration.connected",
        provider: connection.provider,
        triggeredAt
      });
    });
  }

  private buildAffectedScopes(activity: ActivitySummary): LeaderboardScope[] {
    const athlete = this.db.users.find((user) => user.id === activity.userId);

    return [
      {
        id: "global",
        type: "global",
        label: "Global distance",
        window: "all_time"
      },
      {
        id: "scope:friends:monthly",
        type: "friends",
        label: "Friends this month",
        window: "month"
      },
      {
        id: `scope:local:${athlete?.city ?? "unknown"}`,
        type: "local",
        label: `${athlete?.city ?? "Local"} monthly`,
        city: athlete?.city,
        region: athlete?.region,
        countryCode: athlete?.countryCode,
        window: "month"
      }
    ];
  }

  private findActivity(activityId: string) {
    return this.db.activities.find((activity) => activity.id === activityId) ?? null;
  }

  private findAthlete(userId: string) {
    return this.db.users.find((user) => user.id === userId) ?? null;
  }

  private validateActivity(activity: ActivitySummary) {
    const flags: string[] = [];
    const speed = activity.averageSpeedMps ?? (activity.movingTimeSeconds > 0 ? activity.distanceMeters / activity.movingTimeSeconds : 0);
    const stream = this.db.activityStreams.get(activity.id) ?? [];

    if (speed > 12) {
      flags.push("unrealistic_speed");
    }

    for (let index = 1; index < stream.length; index += 1) {
      const previous = stream[index - 1];
      const current = stream[index];
      const seconds = Math.max(1, (Date.parse(current.ts) - Date.parse(previous.ts)) / 1000);
      const meters = this.distanceMeters(previous.lat, previous.lng, current.lat, current.lng);

      if (meters / seconds > 20) {
        flags.push("gps_jump");
        break;
      }
    }

    return flags;
  }

  private upsertLeaderboardEntry(scope: LeaderboardScope, entry: LeaderboardEntry) {
    const existing = this.db.leaderboards.get(scope.id);
    const current = existing?.top ?? [];
    const updated = [...current.filter((item) => item.athleteId !== entry.athleteId), entry]
      .sort((left, right) => right.score - left.score)
      .map((item, index) => ({ ...item, rank: index + 1 }));

    this.db.leaderboards.set(scope.id, {
      scope,
      top: updated.slice(0, 50),
      aroundUser: updated.filter((item) => item.athleteId === entry.athleteId),
      percentile: updated.length ? 100 - ((updated.findIndex((item) => item.athleteId === entry.athleteId) + 1) / updated.length) * 100 : 100,
      updatedAt: new Date().toISOString()
    });
  }

  private pushFeed(key: string, entry: FeedEntry) {
    const current = this.db.precomputedFeeds.get(key) ?? [];
    this.db.precomputedFeeds.set(key, [entry, ...current].slice(0, 100));
  }

  private distanceMeters(fromLat: number, fromLng: number, toLat: number, toLng: number) {
    const radiusMeters = 6371000;
    const lat1 = this.toRadians(fromLat);
    const lat2 = this.toRadians(toLat);
    const deltaLat = this.toRadians(toLat - fromLat);
    const deltaLng = this.toRadians(toLng - fromLng);
    const a =
      Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);

    return radiusMeters * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  private toRadians(value: number) {
    return (value * Math.PI) / 180;
  }
}
