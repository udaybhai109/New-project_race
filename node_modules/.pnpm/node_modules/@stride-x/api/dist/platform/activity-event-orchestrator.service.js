"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityEventOrchestrator = void 0;
const common_1 = require("@nestjs/common");
const eventing_1 = require("@stride-x/eventing");
const domain_event_bus_service_1 = require("./domain-event-bus.service");
const in_memory_db_service_1 = require("./in-memory-db.service");
let ActivityEventOrchestrator = class ActivityEventOrchestrator {
    constructor(eventBus, db) {
        this.eventBus = eventBus;
        this.db = db;
    }
    onModuleInit() {
        this.eventBus.on(eventing_1.eventTopics.activityCompleted, ({ activity, triggeredAt }) => {
            const scopes = this.buildAffectedScopes(activity);
            this.eventBus.emit(eventing_1.eventTopics.activityValidationRequested, {
                activityId: activity.id,
                athleteId: activity.userId,
                leaderboardScopes: scopes,
                triggeredAt
            });
        });
        this.eventBus.on(eventing_1.eventTopics.activityValidationRequested, (payload) => {
            const activity = this.findActivity(payload.activityId);
            const flags = activity ? this.validateActivity(activity) : ["activity_not_found"];
            const verdict = flags.length ? "flagged" : "passed";
            const suspiciousScore = Math.min(100, flags.length * 50);
            console.log(`[VALIDATION] ${verdict}`);
            this.eventBus.emit(eventing_1.eventTopics.activityValidationCompleted, {
                activityId: payload.activityId,
                athleteId: payload.athleteId,
                verdict,
                suspiciousScore,
                flags,
                leaderboardScopes: payload.leaderboardScopes,
                processedAt: new Date().toISOString()
            });
        });
        this.eventBus.on(eventing_1.eventTopics.activityValidationCompleted, (payload) => {
            this.db.validationVerdicts.push({
                activityId: payload.activityId,
                athleteId: payload.athleteId,
                verdict: payload.verdict,
                suspiciousScore: payload.suspiciousScore,
                flags: payload.flags,
                checkedAt: payload.processedAt
            });
            if (payload.verdict === "passed") {
                this.eventBus.emit(eventing_1.eventTopics.leaderboardUpdateRequested, {
                    activityId: payload.activityId,
                    athleteId: payload.athleteId,
                    scopes: payload.leaderboardScopes,
                    triggeredAt: payload.processedAt
                });
            }
        });
        this.eventBus.on(eventing_1.eventTopics.leaderboardUpdateRequested, (payload) => {
            const activity = this.findActivity(payload.activityId);
            if (!activity)
                return;
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
            this.eventBus.emit(eventing_1.eventTopics.leaderboardUpdated, {
                activityId: payload.activityId,
                athleteId: payload.athleteId,
                scopes: payload.scopes,
                triggeredAt: new Date().toISOString()
            });
            this.eventBus.emit(eventing_1.eventTopics.feedFanoutRequested, {
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
        this.eventBus.on(eventing_1.eventTopics.feedFanoutRequested, (payload) => {
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
            this.eventBus.emit(eventing_1.eventTopics.feedFanoutCompleted, {
                activityId: payload.activityId,
                athleteId: payload.athleteId,
                triggeredAt: now
            });
            this.eventBus.emit(eventing_1.eventTopics.mediaRequested, {
                activityId: payload.activityId,
                athleteId: payload.athleteId,
                variants: ["share_card", "route_video", "thumbnail"],
                triggeredAt: now
            });
        });
        this.eventBus.on(eventing_1.eventTopics.mediaRequested, (payload) => {
            console.log("[MEDIA] generated");
            this.eventBus.emit(eventing_1.eventTopics.mediaCompleted, {
                activityId: payload.activityId,
                athleteId: payload.athleteId,
                variants: payload.variants,
                triggeredAt: new Date().toISOString()
            });
            this.eventBus.emit(eventing_1.eventTopics.shareRequested, {
                activityId: payload.activityId,
                athleteId: payload.athleteId,
                platforms: ["instagram", "whatsapp", "facebook", "x", "deep_link"],
                triggeredAt: new Date().toISOString()
            });
        });
        this.eventBus.on(eventing_1.eventTopics.shareRequested, (payload) => {
            const activity = this.findActivity(payload.activityId);
            if (!activity)
                return;
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
            this.eventBus.emit(eventing_1.eventTopics.shareCompleted, {
                activityId: payload.activityId,
                athleteId: payload.athleteId,
                triggeredAt: new Date().toISOString()
            });
        });
        this.eventBus.on(eventing_1.eventTopics.eventTimingIngested, ({ timing, triggeredAt }) => {
            this.eventBus.emit(eventing_1.eventTopics.leaderboardUpdateRequested, {
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
        this.eventBus.on(eventing_1.eventTopics.integrationConnected, ({ connection, triggeredAt }) => {
            this.eventBus.emit("audit.log", {
                actorId: connection.userId,
                action: "integration.connected",
                provider: connection.provider,
                triggeredAt
            });
        });
    }
    buildAffectedScopes(activity) {
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
    findActivity(activityId) {
        return this.db.activities.find((activity) => activity.id === activityId) ?? null;
    }
    findAthlete(userId) {
        return this.db.users.find((user) => user.id === userId) ?? null;
    }
    validateActivity(activity) {
        const flags = [];
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
    upsertLeaderboardEntry(scope, entry) {
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
    pushFeed(key, entry) {
        const current = this.db.precomputedFeeds.get(key) ?? [];
        this.db.precomputedFeeds.set(key, [entry, ...current].slice(0, 100));
    }
    distanceMeters(fromLat, fromLng, toLat, toLng) {
        const radiusMeters = 6371000;
        const lat1 = this.toRadians(fromLat);
        const lat2 = this.toRadians(toLat);
        const deltaLat = this.toRadians(toLat - fromLat);
        const deltaLng = this.toRadians(toLng - fromLng);
        const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
            Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);
        return radiusMeters * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }
    toRadians(value) {
        return (value * Math.PI) / 180;
    }
};
exports.ActivityEventOrchestrator = ActivityEventOrchestrator;
exports.ActivityEventOrchestrator = ActivityEventOrchestrator = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [domain_event_bus_service_1.DomainEventBus,
        in_memory_db_service_1.InMemoryDb])
], ActivityEventOrchestrator);
//# sourceMappingURL=activity-event-orchestrator.service.js.map