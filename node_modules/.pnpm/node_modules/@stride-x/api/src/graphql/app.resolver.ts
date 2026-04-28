import { Query, Resolver, Args } from "@nestjs/graphql";
import { AnalyticsService } from "../modules/analytics/analytics.service";
import { ActivitiesService } from "../modules/activities/activities.service";
import { ClubsService } from "../modules/clubs/clubs.service";
import { EventsService } from "../modules/events/events.service";
import { LeaderboardsService } from "../modules/leaderboards/leaderboards.service";
import { SocialService } from "../modules/social/social.service";
import {
  DashboardView,
  GraphqlActivityDetail,
  GraphqlClubView,
  GraphqlEventSpectatorView,
  GraphqlInsight,
  GraphqlLeaderboardSlice
} from "./models";

@Resolver()
export class AppGraphqlResolver {
  constructor(
    private readonly activitiesService: ActivitiesService,
    private readonly clubsService: ClubsService,
    private readonly eventsService: EventsService,
    private readonly leaderboardsService: LeaderboardsService,
    private readonly socialService: SocialService,
    private readonly analyticsService: AnalyticsService
  ) {}

  @Query(() => DashboardView)
  meDashboard(): DashboardView {
    return {
      feedIds: this.socialService.feed().map((item) => item.id),
      activeChallenges: ["challenge_april_100k"],
      upcomingEventIds: this.eventsService.list().map((event) => event.id)
    };
  }

  @Query(() => [String])
  feed() {
    return this.socialService.feed().map((item) => item.id);
  }

  @Query(() => GraphqlActivityDetail, { nullable: true })
  activityDetail(@Args("id") id: string): GraphqlActivityDetail | null {
    const activity = this.activitiesService.findOne(id);
    if (!activity) return null;

    return {
      id: activity.id,
      title: activity.title,
      type: activity.type,
      distanceMeters: activity.distanceMeters,
      movingTimeSeconds: activity.movingTimeSeconds
    };
  }

  @Query(() => GraphqlLeaderboardSlice, { nullable: true })
  leaderboardView(@Args("scopeId") scopeId: string): GraphqlLeaderboardSlice | null {
    const slice = this.leaderboardsService.getSlice(scopeId);
    if (!slice) return null;

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

  @Query(() => GraphqlClubView, { nullable: true })
  clubView(@Args("clubId") clubId: string): GraphqlClubView | null {
    const club = this.clubsService.findOne(clubId);
    if (!club) return null;
    return club;
  }

  @Query(() => GraphqlEventSpectatorView, { nullable: true })
  eventSpectatorView(@Args("eventId") eventId: string): GraphqlEventSpectatorView | null {
    return this.eventsService.spectatorView(eventId);
  }

  @Query(() => [GraphqlInsight])
  trainingInsights(@Args("athleteId") athleteId: string): GraphqlInsight[] {
    return this.analyticsService.trainingInsights(athleteId).map((insight) => ({
      id: insight.id,
      title: insight.title,
      summary: insight.summary
    }));
  }
}

