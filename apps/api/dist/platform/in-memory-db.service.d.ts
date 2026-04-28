import type { ActivityStreamPoint, ActivitySummary, CheerEvent, FeedEntry, IntegrationConnection, LeaderboardSlice, LiveSpectatorPosition, RaceTimingEvent, UserProfile, ValidationVerdict } from "@stride-x/domain-types";
export declare class InMemoryDb {
    readonly users: UserProfile[];
    readonly activities: ActivitySummary[];
    readonly activityStreams: Map<string, ActivityStreamPoint[]>;
    readonly leaderboards: Map<string, LeaderboardSlice>;
    readonly timingEvents: RaceTimingEvent[];
    readonly liveRaceSessions: Map<string, {
        eventId: string;
        status: "live" | "ended";
        startedAt: string;
    }>;
    readonly raceCheckpoints: Map<string, {
        id: string;
        lat: number;
        lng: number;
    }[]>;
    readonly raceProgress: Map<string, Map<string, {
        athleteId: string;
        lastCheckpointId: string | null;
        checkpointCount: number;
        lastUpdated: string;
    }>>;
    readonly livePositions: LiveSpectatorPosition[];
    readonly cheers: CheerEvent[];
    readonly integrations: IntegrationConnection[];
    readonly follows: {
        followerUserId: string;
        followeeUserId: string;
    }[];
    readonly clubMemberships: {
        clubId: string;
        userId: string;
    }[];
    readonly challengeMemberships: {
        challengeId: string;
        userId: string;
    }[];
    readonly validationVerdicts: ValidationVerdict[];
    readonly precomputedFeeds: Map<string, FeedEntry[]>;
    readonly shareBundles: Map<string, unknown>;
}
//# sourceMappingURL=in-memory-db.service.d.ts.map