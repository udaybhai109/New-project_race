var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { LeaderboardService } from "./leaderboard.service";
let LeaderboardController = class LeaderboardController {
    leaderboardService;
    constructor(leaderboardService) {
        this.leaderboardService = leaderboardService;
    }
    update(body) {
        return { data: this.leaderboardService.updateAffectedScopes(body.updates) };
    }
    top(scopeId, limit) {
        return { data: this.leaderboardService.getTop(scopeId, limit ? Number(limit) : 10) };
    }
    near(scopeId, athleteId) {
        return { data: this.leaderboardService.getNearMe(scopeId, athleteId) };
    }
};
__decorate([
    Post("update"),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], LeaderboardController.prototype, "update", null);
__decorate([
    Get("scopes/:scopeId/top"),
    __param(0, Param("scopeId")),
    __param(1, Query("limit")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], LeaderboardController.prototype, "top", null);
__decorate([
    Get("scopes/:scopeId/near/:athleteId"),
    __param(0, Param("scopeId")),
    __param(1, Param("athleteId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], LeaderboardController.prototype, "near", null);
LeaderboardController = __decorate([
    Controller("leaderboards"),
    __metadata("design:paramtypes", [LeaderboardService])
], LeaderboardController);
export { LeaderboardController };
//# sourceMappingURL=leaderboard.controller.js.map