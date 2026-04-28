import type { CheerEvent, LiveSpectatorPosition, RaceTimingEvent } from "@stride-x/domain-types";
import { EventsService } from "./events.service";
export declare class EventsController {
    private readonly eventsService;
    constructor(eventsService: EventsService);
    list(): {
        data: {
            id: string;
            name: string;
            status: import("@stride-x/domain-types").EventStatus;
            city: string;
        }[];
    };
    startRace(id: string): {
        eventId: string;
        status: "live";
        startedAt: string;
    };
    raceSession(id: string): {
        session: {
            eventId: string;
            status: "live" | "ended";
            startedAt: string;
        };
        positions: LiveSpectatorPosition[];
    };
    ingestTiming(id: string, body: RaceTimingEvent): {
        data: {
            queued: boolean;
        };
    };
    ingestLive(id: string, body: LiveSpectatorPosition): {
        data: LiveSpectatorPosition;
    };
    createCheer(id: string, body: Omit<CheerEvent, "id" | "createdAt" | "raceId">): {
        data: CheerEvent;
    };
}
//# sourceMappingURL=events.controller.d.ts.map