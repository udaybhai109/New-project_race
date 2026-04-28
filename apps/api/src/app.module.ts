import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { loadEnv } from "@stride-x/config";
import { join } from "node:path";
import { AnalyticsModule } from "./modules/analytics/analytics.module";
import { AuthModule } from "./modules/auth/auth.module";
import { BillingModule } from "./modules/billing/billing.module";
import { ChallengesModule } from "./modules/challenges/challenges.module";
import { ClubsModule } from "./modules/clubs/clubs.module";
import { EventsModule } from "./modules/events/events.module";
import { FeedModule } from "./modules/feed/feed.module";
import { HealthController } from "./modules/health/health.controller";
import { IntegrationsModule } from "./modules/integrations/integrations.module";
import { LeaderboardsModule } from "./modules/leaderboards/leaderboards.module";
import { NotificationsModule } from "./modules/notifications/notifications.module";
import { ActivitiesModule } from "./modules/activities/activities.module";
import { SegmentsModule } from "./modules/segments/segments.module";
import { ShareModule } from "./modules/share/share.module";
import { SocialModule } from "./modules/social/social.module";
import { UsersModule } from "./modules/users/users.module";
import { AppGraphqlResolver } from "./graphql/app.resolver";
import { PlatformModule } from "./platform/platform.module";
import { ValidationModule } from "./modules/validation/validation.module";

const env = loadEnv({
  ...process.env,
  DATABASE_URL: process.env.DATABASE_URL ?? "https://example.com/database",
  TIMESCALE_URL: process.env.TIMESCALE_URL ?? "https://example.com/timescale",
  REDIS_URL: process.env.REDIS_URL ?? "https://example.com/redis",
  MAPBOX_ACCESS_TOKEN: process.env.MAPBOX_ACCESS_TOKEN ?? "replace-me",
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY ?? "replace-me",
  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID ?? "replace-me",
  JWT_SECRET: process.env.JWT_SECRET ?? "replace-me-long-secret",
  S3_BUCKET_MEDIA: process.env.S3_BUCKET_MEDIA ?? "stride-x-media-dev",
  CDN_BASE_URL: process.env.CDN_BASE_URL ?? "https://cdn.example.com"
});

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), "apps/api/schema.gql"),
      playground: env.GRAPHQL_PLAYGROUND
    }),
    PlatformModule,
    AuthModule,
    UsersModule,
    ActivitiesModule,
    SegmentsModule,
    SocialModule,
    FeedModule,
    ShareModule,
    ValidationModule,
    ClubsModule,
    ChallengesModule,
    EventsModule,
    LeaderboardsModule,
    NotificationsModule,
    BillingModule,
    IntegrationsModule,
    AnalyticsModule
  ],
  controllers: [HealthController],
  providers: [AppGraphqlResolver]
})
export class AppModule {}
