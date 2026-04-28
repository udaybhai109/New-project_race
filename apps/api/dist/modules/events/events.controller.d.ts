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
    startRace(id: string, body?: {
        checkpoints?: Array<{
            id: string;
            lat: number;
            lng: number;
        }>;
    }): {
        checkpoints: {
            id: string;
            lat: number;
            lng: number;
        }[];
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
    raceLeaderboard(id: string): {
        standings: {
            athleteId: string;
            checkpointCount: number;
            lastCheckpointId: string;
            lastUpdated: string;
        }[];
    };
    ingestTiming(id: string, body: RaceTimingEvent): {
        data: {
            queued: boolean;
        };
    };
    ingestLive(id: string, body: LiveSpectatorPosition): {
        data: {
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
    };
    createCheer(id: string, body: Omit<CheerEvent, "id" | "createdAt" | "raceId">): {
        data: CheerEvent;
    };
}
//# sourceMappingURL=events.controller.d.ts.map