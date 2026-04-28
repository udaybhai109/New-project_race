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
exports.IntegrationsService = void 0;
const common_1 = require("@nestjs/common");
const eventing_1 = require("@stride-x/eventing");
const domain_event_bus_service_1 = require("../../platform/domain-event-bus.service");
const id_1 = require("../../platform/id");
const in_memory_db_service_1 = require("../../platform/in-memory-db.service");
let IntegrationsService = class IntegrationsService {
    constructor(db, eventBus) {
        this.db = db;
        this.eventBus = eventBus;
    }
    list(userId) {
        return this.db.integrations.filter((connection) => connection.userId === userId);
    }
    connect(input) {
        const connection = {
            id: (0, id_1.createId)("int"),
            userId: input.userId,
            provider: input.provider,
            status: "active",
            scopes: input.scopes,
            connectedAt: new Date().toISOString(),
            lastSyncedAt: new Date().toISOString()
        };
        this.db.integrations.push(connection);
        this.eventBus.emit(eventing_1.eventTopics.integrationConnected, {
            connection,
            triggeredAt: new Date().toISOString()
        });
        return connection;
    }
};
exports.IntegrationsService = IntegrationsService;
exports.IntegrationsService = IntegrationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [in_memory_db_service_1.InMemoryDb,
        domain_event_bus_service_1.DomainEventBus])
], IntegrationsService);
//# sourceMappingURL=integrations.service.js.map