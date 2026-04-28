var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable } from "@nestjs/common";
let FeedService = class FeedService {
    userFeeds = new Map();
    clubFeeds = new Map();
    challengeFeeds = new Map();
    fanout(input) {
        const now = new Date().toISOString();
        input.audienceUserIds.forEach((userId) => {
            this.push(this.userFeeds, userId, {
                id: `${userId}:${input.activityId}:${now}`,
                userId,
                actorId: input.actorId,
                type: "activity",
                activityId: input.activityId,
                createdAt: now
            });
        });
        input.clubIds.forEach((clubId) => {
            this.push(this.clubFeeds, clubId, {
                id: `${clubId}:${input.activityId}:${now}`,
                userId: clubId,
                actorId: input.actorId,
                type: "club_activity",
                activityId: input.activityId,
                clubId,
                createdAt: now
            });
        });
        input.challengeIds.forEach((challengeId) => {
            this.push(this.challengeFeeds, challengeId, {
                id: `${challengeId}:${input.activityId}:${now}`,
                userId: challengeId,
                actorId: input.actorId,
                type: "challenge_progress",
                activityId: input.activityId,
                challengeId,
                createdAt: now
            });
        });
        return {
            fanoutUsers: input.audienceUserIds.length,
            fanoutClubs: input.clubIds.length,
            fanoutChallenges: input.challengeIds.length
        };
    }
    getUserFeed(userId) {
        return this.userFeeds.get(userId) ?? [];
    }
    getClubFeed(clubId) {
        return this.clubFeeds.get(clubId) ?? [];
    }
    getChallengeFeed(challengeId) {
        return this.challengeFeeds.get(challengeId) ?? [];
    }
    push(target, key, entry) {
        const current = target.get(key) ?? [];
        target.set(key, [entry, ...current].slice(0, 500));
    }
};
FeedService = __decorate([
    Injectable()
], FeedService);
export { FeedService };
//# sourceMappingURL=feed.service.js.map