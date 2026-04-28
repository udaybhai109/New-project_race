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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SegmentsController = void 0;
const common_1 = require("@nestjs/common");
const leaderboards_service_1 = require("../leaderboards/leaderboards.service");
const segments_service_1 = require("./segments.service");
let SegmentsController = class SegmentsController {
    constructor(segmentsService, leaderboardsService) {
        this.segmentsService = segmentsService;
        this.leaderboardsService = leaderboardsService;
    }
    findOne(id) {
        return { data: this.segmentsService.findOne(id) };
    }
    leaderboard(id) {
        return {
            data: this.leaderboardsService.getOrCreateSegmentSlice(id)
        };
    }
};
exports.SegmentsController = SegmentsController;
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SegmentsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(":id/leaderboard"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SegmentsController.prototype, "leaderboard", null);
exports.SegmentsController = SegmentsController = __decorate([
    (0, common_1.Controller)("segments"),
    __metadata("design:paramtypes", [segments_service_1.SegmentsService,
        leaderboards_service_1.LeaderboardsService])
], SegmentsController);
//# sourceMappingURL=segments.controller.js.map