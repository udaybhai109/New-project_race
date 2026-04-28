import { Module } from "@nestjs/common";
import { EventsController } from "./events.controller";
import { EventsService } from "./events.service";
import { RaceGateway } from "./race.gateway";

@Module({
  controllers: [EventsController],
  providers: [EventsService, RaceGateway],
  exports: [EventsService]
})
export class EventsModule {}
