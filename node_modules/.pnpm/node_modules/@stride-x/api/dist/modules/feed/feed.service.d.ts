import { InMemoryDb } from "../../platform/in-memory-db.service";
export declare class FeedService {
    private readonly db;
    constructor(db: InMemoryDb);
    getFeed(userId?: string): {
        entries: import("@stride-x/domain-types").FeedEntry[];
    };
}
//# sourceMappingURL=feed.service.d.ts.map