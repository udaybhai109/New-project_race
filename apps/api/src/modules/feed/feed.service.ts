import { Injectable } from "@nestjs/common";
import { InMemoryDb } from "../../platform/in-memory-db.service";

@Injectable()
export class FeedService {
  constructor(private readonly db: InMemoryDb) {}

  getFeed(userId = "user_demo") {
    return {
      entries: this.db.precomputedFeeds.get(userId) ?? []
    };
  }
}
