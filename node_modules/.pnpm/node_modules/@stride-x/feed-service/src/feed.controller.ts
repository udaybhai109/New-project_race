import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { FeedService } from "./feed.service";

@Controller("feeds")
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Post("fanout")
  fanout(
    @Body()
    body: {
      activityId: string;
      actorId: string;
      audienceUserIds: string[];
      clubIds: string[];
      challengeIds: string[];
    }
  ) {
    return { data: this.feedService.fanout(body) };
  }

  @Get("users/:userId")
  userFeed(@Param("userId") userId: string) {
    return { data: this.feedService.getUserFeed(userId) };
  }

  @Get("clubs/:clubId")
  clubFeed(@Param("clubId") clubId: string) {
    return { data: this.feedService.getClubFeed(clubId) };
  }

  @Get("challenges/:challengeId")
  challengeFeed(@Param("challengeId") challengeId: string) {
    return { data: this.feedService.getChallengeFeed(challengeId) };
  }
}

