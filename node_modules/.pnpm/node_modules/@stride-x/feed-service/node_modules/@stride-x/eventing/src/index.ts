import type {
  ActivitySummary,
  CheerEvent,
  IntegrationConnection,
  LeaderboardScope,
  LiveSpectatorPosition,
  RaceTimingEvent
} from "@stride-x/domain-types";

export const eventTopics = {
  activityCompleted: "activity.completed",
  activityStreamsStored: "activity.streams.stored",
  activityValidationRequested: "activity.validation.requested",
  activityValidationCompleted: "activity.validation.completed",
  leaderboardUpdateRequested: "leaderboard.update.requested",
  leaderboardUpdated: "leaderboard.updated",
  feedFanoutRequested: "feed.fanout.requested",
  feedFanoutCompleted: "feed.fanout.completed",
  mediaRequested: "media.requested",
  mediaCompleted: "media.completed",
  shareRequested: "share.requested",
  shareCompleted: "share.completed",
  eventTimingIngested: "event.timing.ingested",
  eventLivePositionIngested: "event.live_position.ingested",
  integrationConnected: "integration.connected",
  cheerBroadcastRequested: "cheer.broadcast.requested"
} as const;

export const eventStreams = {
  validation: "stream:validation",
  leaderboard: "stream:leaderboard",
  feedFanout: "stream:feed_fanout",
  media: "stream:media",
  share: "stream:share"
} as const;

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
