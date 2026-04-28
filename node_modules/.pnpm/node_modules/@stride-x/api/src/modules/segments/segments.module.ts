import { Module } from "@nestjs/common";
import { LeaderboardsModule } from "../leaderboards/leaderboards.module";
import { SegmentsController } from "./segments.controller";
import { SegmentsService } from "./segments.service";

@Module({
  imports: [LeaderboardsModule],
  controllers: [SegmentsController],
  providers: [SegmentsService],
  exports: [SegmentsService]
})
export class SegmentsModule {}

