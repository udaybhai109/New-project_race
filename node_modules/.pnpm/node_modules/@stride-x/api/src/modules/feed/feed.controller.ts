import { Controller, Get, Query } from "@nestjs/common";
import { FeedService } from "./feed.service";

@Controller("feed")
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Get()
  getFeed(@Query("userId") userId = "user_demo") {
    return this.feedService.getFeed(userId);
  }
}
