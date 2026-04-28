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
exports.LeaderboardsService = void 0;
const common_1 = require("@nestjs/common");
const in_memory_db_service_1 = require("../../platform/in-memory-db.service");
let LeaderboardsService = class LeaderboardsService {
    constructor(db) {
        this.db = db;
    }
    getSlice(scopeId) {
        return this.db.leaderboards.get(scopeId) ?? null;
    }
    getGlobal(userId) {
        const slice = this.db.leaderboards.get("global");
        const entries = slice?.top ?? [];
        const userEntry = entries.find((entry) => entry.athleteId === userId) ?? null;
        return {
            topUsers: entries.slice(0, 10),
            userRank: userEntry?.rank ?? null,
            updatedAt: slice?.updatedAt ?? null
        };
    }
    getOrCreateSegmentSlice(segmentId) {
        const scopeId = `segment:${segmentId}`;
        const existing = this.db.leaderboards.get(scopeId);
        if (existing)
            return existing;
        const slice = {
            scope: {
                id: scopeId,
                type: "segment",
                label: "Marine Drive Sprint",
                segmentId,
                city: "Mumbai",
                region: "Maharashtra",
                countryCode: "IN",
                window: "month"
            },
            top: [
                {
                    scopeId,
                    athleteId: "user_demo",
                    athleteName: "Demo Runner",
                    rank: 1,
                    score: 241,
                    statLabel: "3:59",
                    updatedAt: new Date().toISOString()
                }
            ],
            aroundUser: [],
            percentile: 99,
            updatedAt: new Date().toISOString()
        };
        this.db.leaderboards.set(scopeId, slice);
        return slice;
    }
};
exports.LeaderboardsService = LeaderboardsService;
exports.LeaderboardsService = LeaderboardsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [in_memory_db_service_1.InMemoryDb])
], LeaderboardsService);
//# sourceMappingURL=leaderboards.service.js.map