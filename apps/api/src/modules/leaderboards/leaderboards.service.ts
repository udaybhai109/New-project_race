import { Injectable } from "@nestjs/common";
import type { LeaderboardSlice } from "@stride-x/domain-types";
import { InMemoryDb } from "../../platform/in-memory-db.service";

@Injectable()
export class LeaderboardsService {
  constructor(private readonly db: InMemoryDb) {}

  getSlice(scopeId: string) {
    return this.db.leaderboards.get(scopeId) ?? null;
  }

  getGlobal(userId: string) {
    const slice = this.db.leaderboards.get("global");
    const entries = slice?.top ?? [];
    const userEntry = entries.find((entry) => entry.athleteId === userId) ?? null;

    return {
      topUsers: entries.slice(0, 10),
      userRank: userEntry?.rank ?? null,
      updatedAt: slice?.updatedAt ?? null
    };
  }

  getOrCreateSegmentSlice(segmentId: string): LeaderboardSlice {
    const scopeId = `segment:${segmentId}`;
    const existing = this.db.leaderboards.get(scopeId);
    if (existing) return existing;

    const slice: LeaderboardSlice = {
      scope: {
        id: scopeId,
        type: "segment",
        label: "Marine Drive Sprint",
        segmentId,
        city: "Mumbai",
        region: "Maharashtra",
        countryCode: "IN",
        window: "month"
      },
      top: [
        {
          scopeId,
          athleteId: "user_demo",
          athleteName: "Demo Runner",
          rank: 1,
          score: 241,
          statLabel: "3:59",
          updatedAt: new Date().toISOString()
        }
      ],
      aroundUser: [],
      percentile: 99,
      updatedAt: new Date().toISOString()
    };

    this.db.leaderboards.set(scopeId, slice);
    return slice;
  }
}
