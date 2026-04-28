import { Controller, Get, Param } from "@nestjs/common";
import { LeaderboardsService } from "../leaderboards/leaderboards.service";
import { SegmentsService } from "./segments.service";

@Controller("segments")
export class SegmentsController {
  constructor(
    private readonly segmentsService: SegmentsService,
    private readonly leaderboardsService: LeaderboardsService
  ) {}

  @Get(":id")
  findOne(@Param("id") id: string) {
    return { data: this.segmentsService.findOne(id) };
  }

  @Get(":id/leaderboard")
  leaderboard(@Param("id") id: string) {
    return {
      data: this.leaderboardsService.getOrCreateSegmentSlice(id)
    };
  }
}

