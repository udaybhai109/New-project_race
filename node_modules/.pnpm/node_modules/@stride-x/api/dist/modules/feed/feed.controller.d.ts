import { FeedService } from "./feed.service";
export declare class FeedController {
    private readonly feedService;
    constructor(feedService: FeedService);
    getFeed(userId?: string): {
        entries: import("@stride-x/domain-types").FeedEntry[];
    };
}
//# sourceMappingURL=feed.controller.d.ts.map