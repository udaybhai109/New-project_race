import { AnalyticsService } from "../modules/analytics/analytics.service";
import { ActivitiesService } from "../modules/activities/activities.service";
import { ClubsService } from "../modules/clubs/clubs.service";
import { EventsService } from "../modules/events/events.service";
import { LeaderboardsService } from "../modules/leaderboards/leaderboards.service";
import { SocialService } from "../modules/social/social.service";
import { DashboardView, GraphqlActivityDetail, GraphqlClubView, GraphqlEventSpectatorView, GraphqlInsight, GraphqlLeaderboardSlice } from "./models";
export declare class AppGraphqlResolver {
    private readonly activitiesService;
    private readonly clubsService;
    private readonly eventsService;
    private readonly leaderboardsService;
    private readonly socialService;
    private readonly analyticsService;
    constructor(activitiesService: ActivitiesService, clubsService: ClubsService, eventsService: EventsService, leaderboardsService: LeaderboardsService, socialService: SocialService, analyticsService: AnalyticsService);
    meDashboard(): DashboardView;
    feed(): string[];
    activityDetail(id: string): GraphqlActivityDetail | null;
    leaderboardView(scopeId: string): GraphqlLeaderboardSlice | null;
    clubView(clubId: string): GraphqlClubView | null;
    eventSpectatorView(eventId: string): GraphqlEventSpectatorView | null;
    trainingInsights(athleteId: string): GraphqlInsight[];
}
//# sourceMappingURL=app.resolver.d.ts.map