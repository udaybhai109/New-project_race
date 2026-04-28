import type {
  ActivitySummary,
  CheerEvent,
  IntegrationConnection,
  LeaderboardScope,
  LiveSpectatorPosition,
  RaceTimingEvent
} from "@stride-x/domain-types";

export declare const eventTopics: {
  readonly activityCompleted: "activity.completed";
  readonly activityStreamsStored: "activity.streams.stored";
  readonly activityValidationRequested: "activity.validation.requested";
  readonly activityValidationCompleted: "activity.validation.completed";
  readonly leaderboardUpdateRequested: "leaderboard.update.requested";
  readonly leaderboardUpdated: "leaderboard.updated";
  readonly feedFanoutRequested: "feed.fanout.requested";
  readonly feedFanoutCompleted: "feed.fanout.completed";
  readonly mediaRequested: "media.requested";
  readonly mediaCompleted: "media.completed";
  readonly shareRequested: "share.requested";
  readonly shareCompleted: "share.completed";
  readonly eventTimingIngested: "event.timing.ingested";
  readonly eventLivePositionIngested: "event.live_position.ingested";
  readonly integrationConnected: "integration.connected";
  readonly cheerBroadcastRequested: "cheer.broadcast.requested";
};

export declare const eventStreams: {
  readonly validation: "stream:validation";
  readonly leaderboard: "stream:leaderboard";
  readonly feedFanout: "stream:feed_fanout";
  readonly media: "stream:media";
  readonly share: "stream:share";
};

export type EventTopic = (typeof eventTopics)[keyof typeof eventTopics];

export type ActivityCompletedEvent = {
  activity: ActivitySummary;
  triggeredAt: string;
  source: "mobile_sync" | "api";
};

export type ValidationRequestedEvent = {
  activityId: string;
  athleteId: string;
  leaderboardScopes: LeaderboardScope[];
  triggeredAt: string;
};

export type ValidationCompletedEvent = {
  activityId: string;
  athleteId: string;
  verdict: "passed" | "flagged";
  suspiciousScore: number;
  flags: string[];
  leaderboardScopes: LeaderboardScope[];
  processedAt: string;
};

export type LeaderboardUpdateRequestedEvent = {
  activityId: string;
  athleteId: string;
  scopes: LeaderboardScope[];
  triggeredAt: string;
};

export type FeedFanoutRequestedEvent = {
  activityId: string;
  athleteId: string;
  audienceUserIds: string[];
  clubIds: string[];
  challengeIds: string[];
  triggeredAt: string;
};

export type MediaRequestedEvent = {
  activityId: string;
  athleteId: string;
  variants: string[];
  triggeredAt: string;
};

export type ShareRequestedEvent = {
  activityId: string;
  athleteId: string;
  platforms: string[];
  triggeredAt: string;
};

export type TimingIngestedEvent = {
  timing: RaceTimingEvent;
  triggeredAt: string;
};

export type LivePositionIngestedEvent = {
  position: LiveSpectatorPosition;
  triggeredAt: string;
};

export type IntegrationConnectedEvent = {
  connection: IntegrationConnection;
  triggeredAt: string;
};

export type CheerBroadcastRequestedEvent = {
  cheer: CheerEvent;
  triggeredAt: string;
};
