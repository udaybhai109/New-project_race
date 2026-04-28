import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import type { LeaderboardScope } from "@stride-x/domain-types";
import { LeaderboardService } from "./leaderboard.service";

@Controller("leaderboards")
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) {}

  @Post("update")
  update(
    @Body()
    body: {
      updates: Array<{
        scope: LeaderboardScope;
        athleteId: string;
        athleteName: string;
        score: number;
        statLabel: string;
      }>;
    }
  ) {
    return { data: this.leaderboardService.updateAffectedScopes(body.updates) };
  }

  @Get("scopes/:scopeId/top")
  top(@Param("scopeId") scopeId: string, @Query("limit") limit?: string) {
    return { data: this.leaderboardService.getTop(scopeId, limit ? Number(limit) : 10) };
  }

  @Get("scopes/:scopeId/near/:athleteId")
  near(@Param("scopeId") scopeId: string, @Param("athleteId") athleteId: string) {
    return { data: this.leaderboardService.getNearMe(scopeId, athleteId) };
  }
}

