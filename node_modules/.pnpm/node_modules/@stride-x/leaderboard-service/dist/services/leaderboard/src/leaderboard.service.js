var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable } from "@nestjs/common";
let LeaderboardService = class LeaderboardService {
    rankings = new Map();
    updateAffectedScopes(inputs) {
        return inputs.map((input) => this.upsert(input));
    }
    getTop(scopeId, limit = 10) {
        return (this.rankings.get(scopeId) ?? []).slice(0, limit);
    }
    getNearMe(scopeId, athleteId, windowSize = 2) {
        const entries = this.rankings.get(scopeId) ?? [];
        const index = entries.findIndex((entry) => entry.athleteId === athleteId);
        if (index === -1)
            return null;
        return {
            scopeId,
            userId: athleteId,
            top: entries.slice(0, 10),
            aroundUser: entries.slice(Math.max(0, index - windowSize), index + windowSize + 1),
            cachedAt: new Date().toISOString()
        };
    }
    upsert(input) {
        const existing = this.rankings.get(input.scope.id) ?? [];
        const withoutAthlete = existing.filter((entry) => entry.athleteId !== input.athleteId);
        withoutAthlete.push({
            scopeId: input.scope.id,
            athleteId: input.athleteId,
            athleteName: input.athleteName,
            rank: 0,
            score: input.score,
            statLabel: input.statLabel,
            updatedAt: new Date().toISOString()
        });
        const ranked = withoutAthlete
            .sort((left, right) => right.score - left.score)
            .map((entry, index) => ({ ...entry, rank: index + 1 }));
        this.rankings.set(input.scope.id, ranked);
        return {
            scope: input.scope,
            top: ranked.slice(0, 10),
            aroundUser: ranked.filter((entry) => entry.athleteId === input.athleteId),
            percentile: ranked.length ? 100 - ((ranked.findIndex((entry) => entry.athleteId === input.athleteId) + 1) / ranked.length) * 100 : 100,
            updatedAt: new Date().toISOString()
        };
    }
};
LeaderboardService = __decorate([
    Injectable()
], LeaderboardService);
export { LeaderboardService };
//# sourceMappingURL=leaderboard.service.js.map