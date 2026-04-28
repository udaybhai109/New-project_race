import { LeaderboardsService } from "./leaderboards.service";
export declare class LeaderboardsController {
    private readonly leaderboardsService;
    constructor(leaderboardsService: LeaderboardsService);
    findOne(scopeId: string): {
        data: import("@stride-x/domain-types").LeaderboardSlice;
    };
    global(userId?: string): {
        topUsers: import("@stride-x/domain-types").LeaderboardEntry[];
        userRank: number;
        updatedAt: string;
    };
}
//# sourceMappingURL=leaderboards.controller.d.ts.map