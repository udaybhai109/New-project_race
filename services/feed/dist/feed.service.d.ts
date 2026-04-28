import type { FeedEntry } from "../../../packages/domain-types/src";
type FanoutRequest = {
    activityId: string;
    actorId: string;
    audienceUserIds: string[];
    clubIds: string[];
    challengeIds: string[];
};
export declare class FeedService {
    private readonly userFeeds;
    private readonly clubFeeds;
    private readonly challengeFeeds;
    fanout(input: FanoutRequest): {
        fanoutUsers: number;
        fanoutClubs: number;
        fanoutChallenges: number;
    };
    getUserFeed(userId: string): FeedEntry[];
    getClubFeed(clubId: string): FeedEntry[];
    getChallengeFeed(challengeId: string): FeedEntry[];
    private push;
}
export {};
//# sourceMappingURL=feed.service.d.ts.map