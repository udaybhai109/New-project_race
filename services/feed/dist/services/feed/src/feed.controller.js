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
import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { FeedService } from "./feed.service";
let FeedController = class FeedController {
    feedService;
    constructor(feedService) {
        this.feedService = feedService;
    }
    fanout(body) {
        return { data: this.feedService.fanout(body) };
    }
    userFeed(userId) {
        return { data: this.feedService.getUserFeed(userId) };
    }
    clubFeed(clubId) {
        return { data: this.feedService.getClubFeed(clubId) };
    }
    challengeFeed(challengeId) {
        return { data: this.feedService.getChallengeFeed(challengeId) };
    }
};
__decorate([
    Post("fanout"),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FeedController.prototype, "fanout", null);
__decorate([
    Get("users/:userId"),
    __param(0, Param("userId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FeedController.prototype, "userFeed", null);
__decorate([
    Get("clubs/:clubId"),
    __param(0, Param("clubId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FeedController.prototype, "clubFeed", null);
__decorate([
    Get("challenges/:challengeId"),
    __param(0, Param("challengeId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FeedController.prototype, "challengeFeed", null);
FeedController = __decorate([
    Controller("feeds"),
    __metadata("design:paramtypes", [FeedService])
], FeedController);
export { FeedController };
//# sourceMappingURL=feed.controller.js.map