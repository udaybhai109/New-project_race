"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryDb = void 0;
const common_1 = require("@nestjs/common");
let InMemoryDb = class InMemoryDb {
    constructor() {
        this.users = [
            {
                id: "user_demo",
                username: "demo.runner",
                displayName: "Demo Runner",
                tier: "premium",
                city: "Mumbai",
                region: "Maharashtra",
                countryCode: "IN",
                createdAt: new Date().toISOString()
            }
        ];
        this.activities = [];
        this.activityStreams = new Map();
        this.leaderboards = new Map();
        this.timingEvents = [];
        this.liveRaceSessions = new Map();
        this.livePositions = [];
        this.cheers = [];
        this.integrations = [];
        this.follows = [{ followerUserId: "user_follower_1", followeeUserId: "user_demo" }];
        this.clubMemberships = [{ clubId: "club_mumbai_runners", userId: "user_demo" }];
        this.challengeMemberships = [{ challengeId: "challenge_april_100k", userId: "user_demo" }];
        this.validationVerdicts = [];
        this.precomputedFeeds = new Map();
        this.shareBundles = new Map();
    }
};
exports.InMemoryDb = InMemoryDb;
exports.InMemoryDb = InMemoryDb = __decorate([
    (0, common_1.Injectable)()
], InMemoryDb);
//# sourceMappingURL=in-memory-db.service.js.map