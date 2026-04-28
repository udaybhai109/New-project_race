import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import type { CheerEvent, LiveSpectatorPosition, RaceTimingEvent } from "@stride-x/domain-types";
import { EventsService } from "./events.service";

@Controller("events")
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  list() {
    return { data: this.eventsService.list() };
  }

  @Post(":id/race/start")
  startRace(@Param("id") id: string, @Body() body?: { checkpoints?: Array<{ id: string; lat: number; lng: number }> }) {
    return this.eventsService.startLiveRace(id, body?.checkpoints);
  }

  @Get(":id/race")
  raceSession(@Param("id") id: string) {
    return this.eventsService.getLiveRace(id);
  }

  @Get(":id/leaderboard")
  raceLeaderboard(@Param("id") id: string) {
    return this.eventsService.getRaceLeaderboard(id);
  }

  @Post(":id/timing-ingest")
  ingestTiming(@Param("id") id: string, @Body() body: RaceTimingEvent) {
    return {
      data: this.eventsService.ingestTimingEvent({
        ...body,
        eventId: id
      })
    };
  }

  @Post(":id/live")
  ingestLive(@Param("id") id: string, @Body() body: LiveSpectatorPosition) {
    return {
      data: this.eventsService.upsertLivePosition({
        ...body,
        raceId: id
      })
    };
  }

  @Post(":id/cheers")
  createCheer(
    @Param("id") id: string,
    @Body() body: Omit<CheerEvent, "id" | "createdAt" | "raceId">
  ) {
    return {
      data: this.eventsService.createCheer({
        ...body,
        raceId: id
      })
    };
  }
}
