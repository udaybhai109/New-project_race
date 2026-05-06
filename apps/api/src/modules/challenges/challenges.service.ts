import { Injectable } from "@nestjs/common";

@Injectable()
export class ChallengesService {
  active() {
    return [
      {
        id: "challenge_april_100k",
        title: "Run 100 km in April",
        participantCount: 12034,
        progressPercent: 62
      },
      {
        id: "challenge_city_streak",
        title: "14 day city streak",
        participantCount: 8421,
        progressPercent: 43
      }
    ];
  }

  join(challengeId: string, userId: string) {
    return {
      challengeId,
      userId,
      joined: true,
      joinedAt: new Date().toISOString()
    };
  }
}
