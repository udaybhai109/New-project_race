import type { LeaderboardSlice } from "@stride-x/domain-types";
import { InMemoryDb } from "../../platform/in-memory-db.service";
export declare class LeaderboardsService {
    private readonly db;
    constructor(db: InMemoryDb);
    getSlice(scopeId: string): LeaderboardSlice;
    getGlobal(userId: string): {
        topUsers: import("@stride-x/domain-types").LeaderboardEntry[];
        userRank: number;
        updatedAt: string;
    };
    getOrCreateSegmentSlice(segmentId: string): LeaderboardSlice;
}
//# sourceMappingURL=leaderboards.service.d.ts.map