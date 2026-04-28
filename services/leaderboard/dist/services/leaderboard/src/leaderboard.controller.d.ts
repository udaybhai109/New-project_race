import type { LeaderboardScope } from "../../../packages/domain-types/src";
import { LeaderboardService } from "./leaderboard.service";
export declare class LeaderboardController {
    private readonly leaderboardService;
    constructor(leaderboardService: LeaderboardService);
    update(body: {
        updates: Array<{
            scope: LeaderboardScope;
            athleteId: string;
            athleteName: string;
            score: number;
            statLabel: string;
        }>;
    }): {
        data: {
            scope: LeaderboardScope;
            top: {
                rank: number;
                scopeId: import("@stride-x/domain-types").Id;
                athleteId: import("@stride-x/domain-types").Id;
                athleteName: string;
                avatarUrl?: string;
                score: number;
                statLabel: string;
                updatedAt: string;
            }[];
            aroundUser: {
                rank: number;
                scopeId: import("@stride-x/domain-types").Id;
                athleteId: import("@stride-x/domain-types").Id;
                athleteName: string;
                avatarUrl?: string;
                score: number;
                statLabel: string;
                updatedAt: string;
            }[];
            percentile: number;
            updatedAt: string;
        }[];
    };
    top(scopeId: string, limit?: string): {
        data: import("@stride-x/domain-types").LeaderboardEntry[];
    };
    near(scopeId: string, athleteId: string): {
        data: import("@stride-x/domain-types").LeaderboardWindow | null;
    };
}
//# sourceMappingURL=leaderboard.controller.d.ts.map