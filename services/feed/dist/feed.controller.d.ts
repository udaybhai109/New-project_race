import { FeedService } from "./feed.service";
export declare class FeedController {
    private readonly feedService;
    constructor(feedService: FeedService);
    fanout(body: {
        activityId: string;
        actorId: string;
        audienceUserIds: string[];
        clubIds: string[];
        challengeIds: string[];
    }): {
        data: {
            fanoutUsers: number;
            fanoutClubs: number;
            fanoutChallenges: number;
        };
    };
    userFeed(userId: string): {
        data: import("@stride-x/domain-types").FeedEntry[];
    };
    clubFeed(clubId: string): {
        data: import("@stride-x/domain-types").FeedEntry[];
    };
    challengeFeed(challengeId: string): {
        data: import("@stride-x/domain-types").FeedEntry[];
    };
}
//# sourceMappingURL=feed.controller.d.ts.map