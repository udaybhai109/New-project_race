import type { CheerEvent, EventStatus, LiveSpectatorPosition, RaceTimingEvent } from "@stride-x/domain-types";
import { DomainEventBus } from "../../platform/domain-event-bus.service";
import { InMemoryDb } from "../../platform/in-memory-db.service";
import { RaceGateway } from "./race.gateway";
export declare class EventsService {
    private readonly db;
    private readonly eventBus;
    private readonly raceGateway;
    constructor(db: InMemoryDb, eventBus: DomainEventBus, raceGateway: RaceGateway);
    list(): {
        id: string;
        name: string;
        status: EventStatus;
        city: string;
    }[];
    ingestTimingEvent(payload: RaceTimingEvent): {
        queued: boolean;
    };
    startLiveRace(eventId: string): {
        eventId: string;
        status: "live";
        startedAt: string;
    };
    getLiveRace(eventId: string): {
        session: {
            eventId: string;
            status: "live" | "ended";
            startedAt: string;
        };
        positions: LiveSpectatorPosition[];
    };
    upsertLivePosition(position: LiveSpectatorPosition): LiveSpectatorPosition;
    createCheer(input: Omit<CheerEvent, "id" | "createdAt">): CheerEvent;
    spectatorView(eventId: string): {
        eventId: string;
        status: string;
        liveAthleteIds: string[];
    };
}
//# sourceMappingURL=events.service.d.ts.map