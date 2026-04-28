"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DomainEventBus = void 0;
const common_1 = require("@nestjs/common");
const node_events_1 = require("node:events");
let DomainEventBus = class DomainEventBus {
    constructor() {
        this.emitter = new node_events_1.EventEmitter();
    }
    emit(event, payload) {
        if (event.includes(".")) {
            console.log(`[EVENT] ${event}`);
        }
        this.emitter.emit(event, payload);
    }
    on(event, handler) {
        this.emitter.on(event, handler);
    }
};
exports.DomainEventBus = DomainEventBus;
exports.DomainEventBus = DomainEventBus = __decorate([
    (0, common_1.Injectable)()
], DomainEventBus);
//# sourceMappingURL=domain-event-bus.service.js.map