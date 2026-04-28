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
exports.ShareService = void 0;
const common_1 = require("@nestjs/common");
const in_memory_db_service_1 = require("../../platform/in-memory-db.service");
let ShareService = class ShareService {
    constructor(db) {
        this.db = db;
    }
    getShare(activityId) {
        const existing = this.db.shareBundles.get(activityId);
        if (existing)
            return existing;
        const activity = this.db.activities.find((item) => item.id === activityId);
        if (!activity) {
            throw new common_1.NotFoundException("activity not found");
        }
        return {
            stats: {
                distanceMeters: activity.distanceMeters,
                durationSeconds: activity.movingTimeSeconds,
                averageSpeedMps: activity.averageSpeedMps
            },
            mapPlaceholder: `map://activity/${activityId}`,
            shareText: `I completed ${(activity.distanceMeters / 1000).toFixed(2)} km on Stride X.`
        };
    }
};
exports.ShareService = ShareService;
exports.ShareService = ShareService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [in_memory_db_service_1.InMemoryDb])
], ShareService);
//# sourceMappingURL=share.service.js.map