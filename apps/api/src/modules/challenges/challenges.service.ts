import { Injectable } from "@nestjs/common";

@Injectable()
export class ChallengesService {
  active() {
    return [
      {
        id: "challenge_april_100k",
        title: "Run 100 km in April",
        participantCount: 12034
      }
    ];
  }
}
