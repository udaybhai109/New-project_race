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
exports.AppGraphqlResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const analytics_service_1 = require("../modules/analytics/analytics.service");
const activities_service_1 = require("../modules/activities/activities.service");
const clubs_service_1 = require("../modules/clubs/clubs.service");
const events_service_1 = require("../modules/events/events.service");
const leaderboards_service_1 = require("../modules/leaderboards/leaderboards.service");
const social_service_1 = require("../modules/social/social.service");
const models_1 = require("./models");
let AppGraphqlResolver = class AppGraphqlResolver {
    constructor(activitiesService, clubsService, eventsService, leaderboardsService, socialService, analyticsService) {
        this.activitiesService = activitiesService;
        this.clubsService = clubsService;
        this.eventsService = eventsService;
        this.leaderboardsService = leaderboardsService;
        this.socialService = socialService;
        this.analyticsService = analyticsService;
    }
    meDashboard() {
        return {
            feedIds: this.socialService.feed().map((item) => item.id),
            activeChallenges: ["challenge_april_100k"],
            upcomingEventIds: this.eventsService.list().map((event) => event.id)
        };
    }
    feed() {
        return this.socialService.feed().map((item) => item.id);
    }
    activityDetail(id) {
        const activity = this.activitiesService.findOne(id);
        if (!activity)
            return null;
        return {
            id: activity.id,
            title: activity.title,
            type: activity.type,
            distanceMeters: activity.distanceMeters,
            movingTimeSeconds: activity.movingTimeSeconds
        };
    }
    leaderboardView(scopeId) {
        const slice = this.leaderboardsService.getSlice(scopeId);
        if (!slice)
            return null;
        return {
            scopeId: slice.scope.id,
            label: slice.scope.label,
            top: slice.top.map((entry) => ({
                athleteId: entry.athleteId,
                athleteName: entry.athleteName,
                rank: entry.rank,
                score: entry.score,
                statLabel: entry.statLabel
            })),
            updatedAt: slice.updatedAt
        };
    }
    clubView(clubId) {
        const club = this.clubsService.findOne(clubId);
        if (!club)
            return null;
        return club;
    }
    eventSpectatorView(eventId) {
        return this.eventsService.spectatorView(eventId);
    }
    trainingInsights(athleteId) {
        return this.analyticsService.trainingInsights(athleteId).map((insight) => ({
            id: insight.id,
            title: insight.title,
            summary: insight.summary
        }));
    }
};
exports.AppGraphqlResolver = AppGraphqlResolver;
__decorate([
    (0, graphql_1.Query)(() => models_1.DashboardView),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", models_1.DashboardView)
], AppGraphqlResolver.prototype, "meDashboard", null);
__decorate([
    (0, graphql_1.Query)(() => [String]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppGraphqlResolver.prototype, "feed", null);
__decorate([
    (0, graphql_1.Query)(() => models_1.GraphqlActivityDetail, { nullable: true }),
    __param(0, (0, graphql_1.Args)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", models_1.GraphqlActivityDetail)
], AppGraphqlResolver.prototype, "activityDetail", null);
__decorate([
    (0, graphql_1.Query)(() => models_1.GraphqlLeaderboardSlice, { nullable: true }),
    __param(0, (0, graphql_1.Args)("scopeId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", models_1.GraphqlLeaderboardSlice)
], AppGraphqlResolver.prototype, "leaderboardView", null);
__decorate([
    (0, graphql_1.Query)(() => models_1.GraphqlClubView, { nullable: true }),
    __param(0, (0, graphql_1.Args)("clubId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", models_1.GraphqlClubView)
], AppGraphqlResolver.prototype, "clubView", null);
__decorate([
    (0, graphql_1.Query)(() => models_1.GraphqlEventSpectatorView, { nullable: true }),
    __param(0, (0, graphql_1.Args)("eventId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", models_1.GraphqlEventSpectatorView)
], AppGraphqlResolver.prototype, "eventSpectatorView", null);
__decorate([
    (0, graphql_1.Query)(() => [models_1.GraphqlInsight]),
    __param(0, (0, graphql_1.Args)("athleteId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Array)
], AppGraphqlResolver.prototype, "trainingInsights", null);
exports.AppGraphqlResolver = AppGraphqlResolver = __decorate([
    (0, graphql_1.Resolver)(),
    __metadata("design:paramtypes", [activities_service_1.ActivitiesService,
        clubs_service_1.ClubsService,
        events_service_1.EventsService,
        leaderboards_service_1.LeaderboardsService,
        social_service_1.SocialService,
        analytics_service_1.AnalyticsService])
], AppGraphqlResolver);
//# sourceMappingURL=app.resolver.js.map