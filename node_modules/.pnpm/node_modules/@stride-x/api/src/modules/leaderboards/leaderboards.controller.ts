import { Controller, Get, Param, Query } from "@nestjs/common";
import { LeaderboardsService } from "./leaderboards.service";

@Controller()
export class LeaderboardsController {
  constructor(private readonly leaderboardsService: LeaderboardsService) {}

  @Get("leaderboards/:scopeId")
  findOne(@Param("scopeId") scopeId: string) {
    return { data: this.leaderboardsService.getSlice(scopeId) };
  }

  @Get("leaderboard/global")
  global(@Query("userId") userId = "user_demo") {
    return this.leaderboardsService.getGlobal(userId);
  }
}
