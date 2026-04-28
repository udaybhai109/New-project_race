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
    startLiveRace(eventId) {
        const session = {
            eventId,
            status: "live",
            startedAt: new Date().toISOString()
        };
        this.db.liveRaceSessions.set(eventId, session);
        return session;
    }
    getLiveRace(eventId) {
        return {
            session: this.db.liveRaceSessions.get(eventId) ?? null,
            positions: this.db.livePositions.filter((position) => position.raceId === eventId)
        };
    }
    upsertLivePosition(position) {
        this.db.livePositions.push(position);
        this.raceGateway.publishPosition(position);
        this.eventBus.emit("event.live_position.ingested", position);
        this.eventBus.emit(eventing_1.eventTopics.eventLivePositionIngested, {
            position,
            triggeredAt: new Date().toISOString()
        });
        return position;
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
};
exports.EventsService = EventsService;
exports.EventsService = EventsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [in_memory_db_service_1.InMemoryDb,
        domain_event_bus_service_1.DomainEventBus,
        race_gateway_1.RaceGateway])
], EventsService);
//# sourceMappingURL=events.service.js.map