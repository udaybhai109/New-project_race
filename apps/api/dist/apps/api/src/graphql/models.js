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
exports.GraphqlInsight = exports.GraphqlEventSpectatorView = exports.GraphqlClubView = exports.GraphqlActivityDetail = exports.GraphqlLeaderboardSlice = exports.GraphqlLeaderboardEntry = exports.DashboardView = void 0;
const graphql_1 = require("@nestjs/graphql");
let DashboardView = class DashboardView {
};
exports.DashboardView = DashboardView;
__decorate([
    (0, graphql_1.Field)(() => [String]),
    __metadata("design:type", Array)
], DashboardView.prototype, "feedIds", void 0);
__decorate([
    (0, graphql_1.Field)(() => [String]),
    __metadata("design:type", Array)
], DashboardView.prototype, "activeChallenges", void 0);
__decorate([
    (0, graphql_1.Field)(() => [String]),
    __metadata("design:type", Array)
], DashboardView.prototype, "upcomingEventIds", void 0);
exports.DashboardView = DashboardView = __decorate([
    (0, graphql_1.ObjectType)()
], DashboardView);
let GraphqlLeaderboardEntry = class GraphqlLeaderboardEntry {
};
exports.GraphqlLeaderboardEntry = GraphqlLeaderboardEntry;
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], GraphqlLeaderboardEntry.prototype, "athleteId", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], GraphqlLeaderboardEntry.prototype, "athleteName", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], GraphqlLeaderboardEntry.prototype, "rank", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], GraphqlLeaderboardEntry.prototype, "score", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], GraphqlLeaderboardEntry.prototype, "statLabel", void 0);
exports.GraphqlLeaderboardEntry = GraphqlLeaderboardEntry = __decorate([
    (0, graphql_1.ObjectType)()
], GraphqlLeaderboardEntry);
let GraphqlLeaderboardSlice = class GraphqlLeaderboardSlice {
};
exports.GraphqlLeaderboardSlice = GraphqlLeaderboardSlice;
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], GraphqlLeaderboardSlice.prototype, "scopeId", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], GraphqlLeaderboardSlice.prototype, "label", void 0);
__decorate([
    (0, graphql_1.Field)(() => [GraphqlLeaderboardEntry]),
    __metadata("design:type", Array)
], GraphqlLeaderboardSlice.prototype, "top", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], GraphqlLeaderboardSlice.prototype, "updatedAt", void 0);
exports.GraphqlLeaderboardSlice = GraphqlLeaderboardSlice = __decorate([
    (0, graphql_1.ObjectType)()
], GraphqlLeaderboardSlice);
let GraphqlActivityDetail = class GraphqlActivityDetail {
};
exports.GraphqlActivityDetail = GraphqlActivityDetail;
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], GraphqlActivityDetail.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], GraphqlActivityDetail.prototype, "title", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], GraphqlActivityDetail.prototype, "type", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], GraphqlActivityDetail.prototype, "distanceMeters", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], GraphqlActivityDetail.prototype, "movingTimeSeconds", void 0);
exports.GraphqlActivityDetail = GraphqlActivityDetail = __decorate([
    (0, graphql_1.ObjectType)()
], GraphqlActivityDetail);
let GraphqlClubView = class GraphqlClubView {
};
exports.GraphqlClubView = GraphqlClubView;
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], GraphqlClubView.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], GraphqlClubView.prototype, "name", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], GraphqlClubView.prototype, "memberCount", void 0);
exports.GraphqlClubView = GraphqlClubView = __decorate([
    (0, graphql_1.ObjectType)()
], GraphqlClubView);
let GraphqlEventSpectatorView = class GraphqlEventSpectatorView {
};
exports.GraphqlEventSpectatorView = GraphqlEventSpectatorView;
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], GraphqlEventSpectatorView.prototype, "eventId", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], GraphqlEventSpectatorView.prototype, "status", void 0);
__decorate([
    (0, graphql_1.Field)(() => [String]),
    __metadata("design:type", Array)
], GraphqlEventSpectatorView.prototype, "liveAthleteIds", void 0);
exports.GraphqlEventSpectatorView = GraphqlEventSpectatorView = __decorate([
    (0, graphql_1.ObjectType)()
], GraphqlEventSpectatorView);
let GraphqlInsight = class GraphqlInsight {
};
exports.GraphqlInsight = GraphqlInsight;
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], GraphqlInsight.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], GraphqlInsight.prototype, "title", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], GraphqlInsight.prototype, "summary", void 0);
exports.GraphqlInsight = GraphqlInsight = __decorate([
    (0, graphql_1.ObjectType)()
], GraphqlInsight);
//# sourceMappingURL=models.js.map