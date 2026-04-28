"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventStreams = exports.eventTopics = void 0;
exports.eventTopics = {
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
};
exports.eventStreams = {
    validation: "stream:validation",
    leaderboard: "stream:leaderboard",
    feedFanout: "stream:feed_fanout",
    media: "stream:media",
    share: "stream:share"
};
//# sourceMappingURL=index.js.map