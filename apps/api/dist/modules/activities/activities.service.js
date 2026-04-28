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
exports.ActivitiesService = void 0;
const common_1 = require("@nestjs/common");
const eventing_1 = require("@stride-x/eventing");
const domain_event_bus_service_1 = require("../../platform/domain-event-bus.service");
const id_1 = require("../../platform/id");
const in_memory_db_service_1 = require("../../platform/in-memory-db.service");
let ActivitiesService = class ActivitiesService {
    constructor(db, eventBus) {
        this.db = db;
        this.eventBus = eventBus;
    }
    list() {
        return this.db.activities;
    }
    findOne(id) {
        return this.db.activities.find((activity) => activity.id === id) ?? null;
    }
    create(input) {
        const distanceMeters = input.distanceMeters ?? input.distance ?? 0;
        const movingTimeSeconds = input.movingTimeSeconds ?? input.duration ?? 0;
        const averageSpeedMps = input.averageSpeedMps ?? (movingTimeSeconds > 0 ? distanceMeters / movingTimeSeconds : 0);
        const activity = {
            id: (0, id_1.createId)("act"),
            userId: input.userId ?? "user_demo",
            type: input.type ?? "run",
            startedAt: input.startedAt ?? new Date().toISOString(),
            endedAt: input.endedAt ?? new Date().toISOString(),
            timezone: input.timezone ?? "Asia/Kolkata",
            title: input.title ?? "Untitled workout",
            description: input.description,
            distanceMeters,
            movingTimeSeconds,
            elapsedTimeSeconds: input.elapsedTimeSeconds ?? movingTimeSeconds,
            elevationGainMeters: input.elevationGainMeters ?? 0,
            averagePaceSecondsPerKm: input.averagePaceSecondsPerKm ?? (distanceMeters > 0 ? movingTimeSeconds / (distanceMeters / 1000) : undefined),
            averageSpeedMps,
            averageHeartRate: input.averageHeartRate,
            maxHeartRate: input.maxHeartRate,
            averageCadence: input.averageCadence,
            averagePowerWatts: input.averagePowerWatts,
            calories: input.calories,
            visibility: input.visibility ?? "followers",
            routeId: input.routeId,
            mediaCount: input.mediaCount ?? 0
        };
        this.db.activities.push(activity);
        if (input.streams?.length) {
            this.storeStreams(activity.id, input.streams);
        }
        this.eventBus.emit("activity.created", activity);
        this.eventBus.emit(eventing_1.eventTopics.activityCompleted, {
            activity,
            triggeredAt: new Date().toISOString(),
            source: "mobile_sync"
        });
        return activity;
    }
    storeStreams(activityId, points) {
        const normalized = points.map((point) => this.normalizeStreamPoint(point));
        const existing = this.db.activityStreams.get(activityId) ?? [];
        const merged = [...existing, ...normalized].sort((a, b) => a.ts.localeCompare(b.ts));
        this.db.activityStreams.set(activityId, merged);
        this.eventBus.emit("activity.streams.stored", { activityId, count: normalized.length });
        this.eventBus.emit(eventing_1.eventTopics.activityStreamsStored, {
            activityId,
            count: normalized.length,
            triggeredAt: new Date().toISOString()
        });
        return { accepted: normalized.length };
    }
    getStreams(activityId) {
        return {
            activityId,
            streams: (this.db.activityStreams.get(activityId) ?? []).map((point) => ({
                lat: point.lat,
                lng: point.lng,
                timestamp: point.ts,
                elevationMeters: point.elevationMeters,
                heartRate: point.heartRate,
                cadence: point.cadence,
                powerWatts: point.powerWatts
            }))
        };
    }
    normalizeStreamPoint(point) {
        return {
            ...point,
            ts: point.ts ?? point.timestamp ?? new Date().toISOString()
        };
    }
};
exports.ActivitiesService = ActivitiesService;
exports.ActivitiesService = ActivitiesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [in_memory_db_service_1.InMemoryDb,
        domain_event_bus_service_1.DomainEventBus])
], ActivitiesService);
//# sourceMappingURL=activities.service.js.map