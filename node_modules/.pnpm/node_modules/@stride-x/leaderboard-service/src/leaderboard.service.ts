import { Injectable } from "@nestjs/common";
import type { LeaderboardEntry, LeaderboardScope, LeaderboardWindow } from "@stride-x/domain-types";

type RankInput = {
  scope: LeaderboardScope;
  athleteId: string;
  athleteName: string;
  score: number;
  statLabel: string;
};

@Injectable()
export class LeaderboardService {
  private readonly rankings = new Map<string, LeaderboardEntry[]>();

  updateAffectedScopes(inputs: RankInput[]) {
    return inputs.map((input) => this.upsert(input));
  }

  getTop(scopeId: string, limit = 10) {
    return (this.rankings.get(scopeId) ?? []).slice(0, limit);
  }

  getNearMe(scopeId: string, athleteId: string, windowSize = 2): LeaderboardWindow | null {
    const entries = this.rankings.get(scopeId) ?? [];
    const index = entries.findIndex((entry) => entry.athleteId === athleteId);
    if (index === -1) return null;

    return {
      scopeId,
      userId: athleteId,
      top: entries.slice(0, 10),
      aroundUser: entries.slice(Math.max(0, index - windowSize), index + windowSize + 1),
      cachedAt: new Date().toISOString()
    };
  }

  private upsert(input: RankInput) {
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
}

