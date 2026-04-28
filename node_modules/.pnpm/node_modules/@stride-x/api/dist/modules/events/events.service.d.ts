import type { CheerEvent, EventStatus, LiveSpectatorPosition, RaceTimingEvent } from "@stride-x/domain-types";
import { DomainEventBus } from "../../platform/domain-event-bus.service";
import { InMemoryDb } from "../../platform/in-memory-db.service";
import { RaceGateway } from "./race.gateway";
type RaceCheckpoint = {
    id: string;
    lat: number;
    lng: number;
};
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
    startLiveRace(eventId: string, checkpoints?: RaceCheckpoint[]): {
        checkpoints: {
            id: string;
            lat: number;
            lng: number;
        }[];
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
        checkpoints: {
            id: string;
            lat: number;
            lng: number;
        }[];
        leaderboard: {
            athleteId: string;
            checkpointCount: number;
            lastCheckpointId: string;
            lastUpdated: string;
        }[];
        positions: LiveSpectatorPosition[];
    };
    upsertLivePosition(position: LiveSpectatorPosition): {
        progress: {
            athleteId: string;
            lastCheckpointId: any;
            checkpointCount: any;
            lastUpdated: string;
        };
        raceId: import("@stride-x/domain-types").Id;
        athleteId: import("@stride-x/domain-types").Id;
        lat: number;
        lng: number;
        paceSecondsPerKm?: number;
        recordedAt: string;
    };
    getRaceLeaderboard(eventId: string): {
        standings: {
            athleteId: string;
            checkpointCount: number;
            lastCheckpointId: string;
            lastUpdated: string;
        }[];
    };
    createCheer(input: Omit<CheerEvent, "id" | "createdAt">): CheerEvent;
    spectatorView(eventId: string): {
        eventId: string;
        status: string;
        liveAthleteIds: string[];
    };
    private updateCheckpointProgress;
    private findReachedCheckpoint;
    private calculateDistance;
    private toRadians;
    private defaultCheckpoints;
}
export {};
//# sourceMappingURL=events.service.d.ts.map