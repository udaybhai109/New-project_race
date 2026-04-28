export type Id = string;

export type ActivityType = "run" | "cycle" | "walk" | "swim" | "gym";
export type EventStatus = "draft" | "published" | "live" | "completed";

export type ActivitySummary = {
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
  visibility: "private" | "followers" | "public";
  routeId?: Id;
  mediaCount: number;
};

export type ActivityStreamPoint = {
  ts: string;
  lat: number;
  lng: number;
  elevationMeters?: number;
  heartRate?: number;
  cadence?: number;
  powerWatts?: number;
};

export type UserProfile = {
  id: Id;
  username: string;
  displayName: string;
  tier: "free" | "premium";
  city?: string;
  region?: string;
  countryCode?: string;
  createdAt: string;
};

export type LeaderboardScope = {
  id: Id;
  type: "global" | "friends" | "local" | "segment" | "event";
  label: string;
  city?: string;
  region?: string;
  countryCode?: string;
  segmentId?: Id;
  eventId?: Id;
  window: "all_time" | "month" | "week" | "event_live";
};

export type LeaderboardEntry = {
  scopeId: Id;
  athleteId: Id;
  athleteName: string;
  rank: number;
  score: number;
  statLabel: string;
  updatedAt: string;
};

export type LeaderboardSlice = {
  scope: LeaderboardScope;
  top: LeaderboardEntry[];
  aroundUser: LeaderboardEntry[];
  percentile: number;
  updatedAt: string;
};

export type LeaderboardWindow = {
  scopeId: Id;
  userId: Id;
  top: LeaderboardEntry[];
  aroundUser: LeaderboardEntry[];
  cachedAt: string;
};

export type FeedEntry = {
  id: Id;
  userId: Id;
  actorId: Id;
  type: "activity" | "activity_post" | "club_activity" | "challenge_progress";
  activityId?: Id;
  clubId?: Id;
  challengeId?: Id;
  createdAt: string;
};

export type RaceTimingEvent = {
  eventId: Id;
  athleteId: Id;
  bibNumber: string;
  checkpointCode: string;
  elapsedMs: number;
  recordedAt: string;
};

export type LiveSpectatorPosition = {
  raceId: Id;
  athleteId: Id;
  lat: number;
  lng: number;
  paceSecondsPerKm?: number;
  recordedAt: string;
};

export type CheerEvent = {
  id: Id;
  raceId: Id;
  fromUserId: Id;
  toAthleteId: Id;
  message: string;
  createdAt: string;
};

export type IntegrationConnection = {
  id: Id;
  userId: Id;
  provider: "healthkit" | "health_connect" | "garmin" | "strava" | "stripe";
  status: "active" | "revoked";
  scopes: string[];
  connectedAt: string;
  lastSyncedAt?: string;
};

export type ValidationVerdict = {
  activityId: Id;
  athleteId: Id;
  verdict: "passed" | "flagged";
  suspiciousScore: number;
  flags: string[];
  checkedAt: string;
};

export type AnalyticsInsight = {
  id: Id;
  athleteId: Id;
  title: string;
  summary: string;
  createdAt: string;
};
