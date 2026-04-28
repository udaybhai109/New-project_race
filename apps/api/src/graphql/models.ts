import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class DashboardView {
  @Field(() => [String])
  feedIds!: string[];

  @Field(() => [String])
  activeChallenges!: string[];

  @Field(() => [String])
  upcomingEventIds!: string[];
}

@ObjectType()
export class GraphqlLeaderboardEntry {
  @Field()
  athleteId!: string;

  @Field()
  athleteName!: string;

  @Field()
  rank!: number;

  @Field()
  score!: number;

  @Field()
  statLabel!: string;
}

@ObjectType()
export class GraphqlLeaderboardSlice {
  @Field()
  scopeId!: string;

  @Field()
  label!: string;

  @Field(() => [GraphqlLeaderboardEntry])
  top!: GraphqlLeaderboardEntry[];

  @Field()
  updatedAt!: string;
}

@ObjectType()
export class GraphqlActivityDetail {
  @Field()
  id!: string;

  @Field()
  title!: string;

  @Field()
  type!: string;

  @Field()
  distanceMeters!: number;

  @Field()
  movingTimeSeconds!: number;
}

@ObjectType()
export class GraphqlClubView {
  @Field()
  id!: string;

  @Field()
  name!: string;

  @Field()
  memberCount!: number;
}

@ObjectType()
export class GraphqlEventSpectatorView {
  @Field()
  eventId!: string;

  @Field()
  status!: string;

  @Field(() => [String])
  liveAthleteIds!: string[];
}

@ObjectType()
export class GraphqlInsight {
  @Field()
  id!: string;

  @Field()
  title!: string;

  @Field()
  summary!: string;
}

