"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const graphql_1 = require("@nestjs/graphql");
const apollo_1 = require("@nestjs/apollo");
const config_2 = require("@stride-x/config");
const node_path_1 = require("node:path");
const analytics_module_1 = require("./modules/analytics/analytics.module");
const auth_module_1 = require("./modules/auth/auth.module");
const billing_module_1 = require("./modules/billing/billing.module");
const challenges_module_1 = require("./modules/challenges/challenges.module");
const clubs_module_1 = require("./modules/clubs/clubs.module");
const events_module_1 = require("./modules/events/events.module");
const feed_module_1 = require("./modules/feed/feed.module");
const health_controller_1 = require("./modules/health/health.controller");
const integrations_module_1 = require("./modules/integrations/integrations.module");
const leaderboards_module_1 = require("./modules/leaderboards/leaderboards.module");
const notifications_module_1 = require("./modules/notifications/notifications.module");
const activities_module_1 = require("./modules/activities/activities.module");
const segments_module_1 = require("./modules/segments/segments.module");
const share_module_1 = require("./modules/share/share.module");
const social_module_1 = require("./modules/social/social.module");
const users_module_1 = require("./modules/users/users.module");
const app_resolver_1 = require("./graphql/app.resolver");
const platform_module_1 = require("./platform/platform.module");
const validation_module_1 = require("./modules/validation/validation.module");
const env = (0, config_2.loadEnv)({
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
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            graphql_1.GraphQLModule.forRoot({
                driver: apollo_1.ApolloDriver,
                autoSchemaFile: (0, node_path_1.join)(process.cwd(), "apps/api/schema.gql"),
                playground: env.GRAPHQL_PLAYGROUND
            }),
            platform_module_1.PlatformModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            activities_module_1.ActivitiesModule,
            segments_module_1.SegmentsModule,
            social_module_1.SocialModule,
            feed_module_1.FeedModule,
            share_module_1.ShareModule,
            validation_module_1.ValidationModule,
            clubs_module_1.ClubsModule,
            challenges_module_1.ChallengesModule,
            events_module_1.EventsModule,
            leaderboards_module_1.LeaderboardsModule,
            notifications_module_1.NotificationsModule,
            billing_module_1.BillingModule,
            integrations_module_1.IntegrationsModule,
            analytics_module_1.AnalyticsModule
        ],
        controllers: [health_controller_1.HealthController],
        providers: [app_resolver_1.AppGraphqlResolver]
    })
], AppModule);
//# sourceMappingURL=app.module.js.map