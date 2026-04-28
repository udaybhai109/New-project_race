export type Id = string;
export type ActivityType = "run" | "ride" | "walk" | "swim" | "hike" | "gym" | "workout";
export type Visibility = "public" | "followers" | "private";
export type LeaderboardScopeType = "global" | "friends" | "local" | "segment" | "event" | "club";
export type EventStatus = "draft" | "published" | "live" | "completed" | "cancelled";
export type SubscriptionTier = "free" | "premium" | "organizer";
export type SharePlatform = "instagram" | "whatsapp" | "facebook" | "x" | "deep_link";
export type ShareAssetVariant = "share_card" | "flex_card" | "route_video" | "thumbnail";
export type IntegrationProvider = "apple_health" | "health_connect" | "garmin" | "strava" | "stripe" | "mapbox" | "timing_vendor";
export interface UserProfile {
    id: Id;
    username: string;
    displayName: string;
    avatarUrl?: string;
    city?: string;
    region?: string;
    countryCode?: string;
    bio?: string;
    tier: SubscriptionTier;
    createdAt: string;
}
export interface ActivitySummary {
    id: Id;
    userId: Id;
    type: ActivityType;
    startedAt: string;
    endedAt: string;
    timezone: string;
    title: string;
    description?: string;
    distanceMeters: number;
    movingTimeSeconds: number;
    elapsedTimeSeconds: number;
    elevationGainMeters: number;
    averagePaceSecondsPerKm?: number;
    averageSpeedMps?: number;
    averageHeartRate?: number;
    maxHeartRate?: number;
    averageCadence?: number;
    averagePowerWatts?: number;
    calories?: number;
    visibility: Visibility;
    routeId?: Id;
    mediaCount: number;
}
export interface ActivityStreamPoint {
    ts: string;
    latitude: number;
    longitude: number;
    altitudeMeters?: number;
    distanceMeters?: number;
    heartRate?: number;
    cadence?: number;
    powerWatts?: number;
    speedMps?: number;
}
export interface SegmentMatchResult {
    segmentId: Id;
    activityId: Id;
    userId: Id;
    elapsedTimeSeconds: number;
    rank?: number;
    personalBest: boolean;
}
export interface LeaderboardScope {
    id: Id;
    type: LeaderboardScopeType;
    label: string;
    segmentId?: Id;
    eventId?: Id;
    clubId?: Id;
    city?: string;
    region?: string;
    countryCode?: string;
    window: "all_time" | "year" | "month" | "week" | "event_live";
}
export interface LeaderboardEntry {
    scopeId: Id;
    athleteId: Id;
    athleteName: string;
    avatarUrl?: string;
    rank: number;
    score: number;
    statLabel: string;
    updatedAt: string;
}
export interface LeaderboardSlice {
    scope: LeaderboardScope;
    top: LeaderboardEntry[];
    aroundUser?: LeaderboardEntry[];
    percentile?: number;
    updatedAt: string;
}
export interface FeedEntry {
    id: Id;
    userId: Id;
    actorId: Id;
    type: "activity" | "club_activity" | "challenge_progress";
    activityId?: Id;
    clubId?: Id;
    challengeId?: Id;
    rankContext?: string;
    createdAt: string;
}
export interface LeaderboardWindow {
    scopeId: Id;
    userId: Id;
    top: LeaderboardEntry[];
    aroundUser: LeaderboardEntry[];
    cachedAt: string;
}
export interface RaceTimingEvent {
    eventId: Id;
    raceId: Id;
    athleteId: Id;
    bibNumber: string;
    checkpointCode: string;
    capturedAt: string;
    elapsedMs: number;
    source: "chip" | "manual" | "vendor";
}
export interface LiveSpectatorPosition {
    raceId: Id;
    athleteId: Id;
    ts: string;
    latitude: number;
    longitude: number;
    speedMps?: number;
    rank?: number;
}
export interface CheerEvent {
    id: Id;
    raceId: Id;
    athleteId: Id;
    senderId: Id;
    senderName: string;
    message: string;
    createdAt: string;
    deliveryChannel: "push" | "audio" | "in_app";
}
export interface AnalyticsInsight {
    id: Id;
    athleteId: Id;
    type: "trend" | "load" | "recovery" | "prediction" | "race_readiness";
    title: string;
    summary: string;
    confidence?: number;
    generatedAt: string;
}
export interface IntegrationConnection {
    id: Id;
    userId: Id;
    provider: IntegrationProvider;
    status: "pending" | "active" | "error" | "revoked";
    connectedAt?: string;
    lastSyncedAt?: string;
    scopes: string[];
}
export interface ShareAsset {
    type: ShareAssetVariant;
    url: string;
    storageKey: string;
    width?: number;
    height?: number;
    durationSeconds?: number;
}
export interface ShareBundle {
    activityId: Id;
    deepLink: string;
    ogUrl: string;
    assets: ShareAsset[];
    platforms: SharePlatform[];
}
export interface ValidationVerdict {
    activityId: Id;
    athleteId: Id;
    verdict: "accepted" | "flagged" | "rejected";
    suspiciousScore: number;
    flags: string[];
    checkedAt: string;
}
export interface ApiEnvelope<T> {
    data: T;
    meta?: Record<string, string | number | boolean | null>;
}
//# sourceMappingURL=index.d.ts.map