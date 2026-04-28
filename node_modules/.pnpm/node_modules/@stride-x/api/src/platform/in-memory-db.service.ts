import { Injectable } from "@nestjs/common";
import type {
  ActivityStreamPoint,
  ActivitySummary,
  CheerEvent,
  FeedEntry,
  IntegrationConnection,
  LeaderboardSlice,
  LiveSpectatorPosition,
  RaceTimingEvent,
  UserProfile,
  ValidationVerdict
} from "@stride-x/domain-types";

@Injectable()
export class InMemoryDb {
  readonly users: UserProfile[] = [
    {
      id: "user_demo",
      username: "demo.runner",
      displayName: "Demo Runner",
      tier: "premium",
      city: "Mumbai",
      region: "Maharashtra",
      countryCode: "IN",
      createdAt: new Date().toISOString()
    }
  ];

  readonly activities: ActivitySummary[] = [];
  readonly activityStreams = new Map<string, ActivityStreamPoint[]>();
  readonly leaderboards = new Map<string, LeaderboardSlice>();
  readonly timingEvents: RaceTimingEvent[] = [];
  readonly liveRaceSessions = new Map<string, { eventId: string; status: "live" | "ended"; startedAt: string }>();
  readonly raceCheckpoints = new Map<string, Array<{ id: string; lat: number; lng: number }>>();
  readonly raceProgress = new Map<string, Map<string, { athleteId: string; lastCheckpointId: string | null; checkpointCount: number; lastUpdated: string }>>();
  readonly livePositions: LiveSpectatorPosition[] = [];
  readonly cheers: CheerEvent[] = [];
  readonly integrations: IntegrationConnection[] = [];
  readonly follows = [{ followerUserId: "user_follower_1", followeeUserId: "user_demo" }];
  readonly clubMemberships = [{ clubId: "club_mumbai_runners", userId: "user_demo" }];
  readonly challengeMemberships = [{ challengeId: "challenge_april_100k", userId: "user_demo" }];
  readonly validationVerdicts: ValidationVerdict[] = [];
  readonly precomputedFeeds = new Map<string, FeedEntry[]>();
  readonly shareBundles = new Map<string, unknown>();
}
