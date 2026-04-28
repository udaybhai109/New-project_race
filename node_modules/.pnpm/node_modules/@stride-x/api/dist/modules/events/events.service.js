"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsService = void 0;
const common_1 = require("@nestjs/common");
const eventing_1 = require("@stride-x/eventing");
const domain_event_bus_service_1 = require("../../platform/domain-event-bus.service");
const id_1 = require("../../platform/id");
const in_memory_db_service_1 = require("../../platform/in-memory-db.service");
const race_gateway_1 = require("./race.gateway");
const CHECKPOINT_REACHED_THRESHOLD_METERS = 50;
let EventsService = class EventsService {
    constructor(db, eventBus, raceGateway) {
        this.db = db;
        this.eventBus = eventBus;
        this.raceGateway = raceGateway;
    }
    list() {
        return [
            {
                id: "event_mumbai_half_2026",
                name: "Mumbai Half Marathon 2026",
                status: "published",
                city: "Mumbai"
            }
        ];
    }
    ingestTimingEvent(payload) {
        this.db.timingEvents.push(payload);
        this.eventBus.emit("event.timing.ingested", payload);
        this.eventBus.emit(eventing_1.eventTopics.eventTimingIngested, {
            timing: payload,
            triggeredAt: new Date().toISOString()
        });
        return { queued: true };
    }
    startLiveRace(eventId, checkpoints) {
        const session = {
            eventId,
            status: "live",
            startedAt: new Date().toISOString()
        };
        this.db.liveRaceSessions.set(eventId, session);
        this.db.raceCheckpoints.set(eventId, checkpoints?.length ? checkpoints : this.defaultCheckpoints(eventId));
        return {
            ...session,
            checkpoints: this.db.raceCheckpoints.get(eventId)
        };
    }
    getLiveRace(eventId) {
        return {
            session: this.db.liveRaceSessions.get(eventId) ?? null,
            checkpoints: this.db.raceCheckpoints.get(eventId) ?? [],
            leaderboard: this.getRaceLeaderboard(eventId).standings,
            positions: this.db.livePositions.filter((position) => position.raceId === eventId)
        };
    }
    upsertLivePosition(position) {
        this.db.livePositions.push(position);
        const progress = this.updateCheckpointProgress(position);
        this.raceGateway.publishPosition(position);
        this.eventBus.emit("event.live_position.ingested", position);
        this.eventBus.emit(eventing_1.eventTopics.eventLivePositionIngested, {
            position,
            triggeredAt: new Date().toISOString()
        });
        return {
            ...position,
            progress
        };
    }
    getRaceLeaderboard(eventId) {
        const standings = Array.from(this.db.raceProgress.get(eventId)?.values() ?? [])
            .sort((left, right) => {
            if (right.checkpointCount !== left.checkpointCount) {
                return right.checkpointCount - left.checkpointCount;
            }
            return Date.parse(right.lastUpdated) - Date.parse(left.lastUpdated);
        })
            .map((progress) => ({
            athleteId: progress.athleteId,
            checkpointCount: progress.checkpointCount,
            lastCheckpointId: progress.lastCheckpointId,
            lastUpdated: progress.lastUpdated
        }));
        return { standings };
    }
    createCheer(input) {
        const cheer = {
            ...input,
            id: (0, id_1.createId)("cheer"),
            createdAt: new Date().toISOString()
        };
        this.db.cheers.push(cheer);
        this.eventBus.emit("event.cheer.created", cheer);
        this.eventBus.emit(eventing_1.eventTopics.cheerBroadcastRequested, {
            cheer,
            triggeredAt: cheer.createdAt
        });
        return cheer;
    }
    spectatorView(eventId) {
        return {
            eventId,
            status: "live",
            liveAthleteIds: this.db.livePositions.filter((item) => item.raceId === eventId).map((item) => item.athleteId)
        };
    }
    updateCheckpointProgress(position) {
        const checkpoints = this.db.raceCheckpoints.get(position.raceId) ?? this.defaultCheckpoints(position.raceId);
        this.db.raceCheckpoints.set(position.raceId, checkpoints);
        const reached = this.findReachedCheckpoint(position, checkpoints);
        const raceProgress = this.db.raceProgress.get(position.raceId) ?? new Map();
        const previous = raceProgress.get(position.athleteId);
        const checkpointIndex = reached ? checkpoints.findIndex((checkpoint) => checkpoint.id === reached.id) : -1;
        const previousIndex = previous?.lastCheckpointId
            ? checkpoints.findIndex((checkpoint) => checkpoint.id === previous.lastCheckpointId)
            : -1;
        const shouldAdvance = checkpointIndex > previousIndex;
        const checkpointCount = shouldAdvance ? checkpointIndex + 1 : previous?.checkpointCount ?? 0;
        const progress = {
            athleteId: position.athleteId,
            lastCheckpointId: shouldAdvance ? reached.id : previous?.lastCheckpointId ?? null,
            checkpointCount,
            lastUpdated: position.recordedAt ?? new Date().toISOString()
        };
        raceProgress.set(position.athleteId, progress);
        this.db.raceProgress.set(position.raceId, raceProgress);
        return progress;
    }
    findReachedCheckpoint(position, checkpoints) {
        return checkpoints
            .map((checkpoint) => ({
            checkpoint,
            distance: this.calculateDistance(position.lat, position.lng, checkpoint.lat, checkpoint.lng)
        }))
            .filter((candidate) => candidate.distance <= CHECKPOINT_REACHED_THRESHOLD_METERS)
            .sort((left, right) => left.distance - right.distance)[0]?.checkpoint ?? null;
    }
    calculateDistance(lat1, lng1, lat2, lng2) {
        const earthRadiusMeters = 6371000;
        const deltaLat = this.toRadians(lat2 - lat1);
        const deltaLng = this.toRadians(lng2 - lng1);
        const fromLat = this.toRadians(lat1);
        const toLat = this.toRadians(lat2);
        const haversine = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
            Math.cos(fromLat) * Math.cos(toLat) * Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);
        return earthRadiusMeters * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
    }
    toRadians(value) {
        return (value * Math.PI) / 180;
    }
    defaultCheckpoints(eventId) {
        return [
            { id: "cp1", lat: 19.076, lng: 72.8777 },
            { id: "cp2", lat: 19.08, lng: 72.88 }
        ].map((checkpoint) => ({ ...checkpoint, id: `${eventId}:${checkpoint.id}` }));
    }
};
exports.EventsService = EventsService;
exports.EventsService = EventsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [in_memory_db_service_1.InMemoryDb,
        domain_event_bus_service_1.DomainEventBus,
        race_gateway_1.RaceGateway])
], EventsService);
//# sourceMappingURL=events.service.js.map