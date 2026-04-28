import { Injectable } from "@nestjs/common";

@Injectable()
export class SocialService {
  feed() {
    return [
      { id: "feed_1", actorId: "user_demo", activityId: "act_demo", type: "activity_post" },
      { id: "feed_2", actorId: "user_demo", challengeId: "challenge_april_100k", type: "challenge_progress" }
    ];
  }
}

