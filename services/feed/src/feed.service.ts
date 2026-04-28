import { Injectable } from "@nestjs/common";
import type { FeedEntry } from "@stride-x/domain-types";

type FanoutRequest = {
  activityId: string;
  actorId: string;
  audienceUserIds: string[];
  clubIds: string[];
  challengeIds: string[];
};

@Injectable()
export class FeedService {
  private readonly userFeeds = new Map<string, FeedEntry[]>();
  private readonly clubFeeds = new Map<string, FeedEntry[]>();
  private readonly challengeFeeds = new Map<string, FeedEntry[]>();

  fanout(input: FanoutRequest) {
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

  getUserFeed(userId: string) {
    return this.userFeeds.get(userId) ?? [];
  }

  getClubFeed(clubId: string) {
    return this.clubFeeds.get(clubId) ?? [];
  }

  getChallengeFeed(challengeId: string) {
    return this.challengeFeeds.get(challengeId) ?? [];
  }

  private push(target: Map<string, FeedEntry[]>, key: string, entry: FeedEntry) {
    const current = target.get(key) ?? [];
    target.set(key, [entry, ...current].slice(0, 500));
  }
}

