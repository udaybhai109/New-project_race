import type { LeaderboardEntry, LeaderboardScope, LeaderboardWindow } from "../../../packages/domain-types/src";
type RankInput = {
    scope: LeaderboardScope;
    athleteId: string;
    athleteName: string;
    score: number;
    statLabel: string;
};
export declare class LeaderboardService {
    private readonly rankings;
    updateAffectedScopes(inputs: RankInput[]): {
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
    getTop(scopeId: string, limit?: number): LeaderboardEntry[];
    getNearMe(scopeId: string, athleteId: string, windowSize?: number): LeaderboardWindow | null;
    private upsert;
}
export {};
//# sourceMappingURL=leaderboard.service.d.ts.map