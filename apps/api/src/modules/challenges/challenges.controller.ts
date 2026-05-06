import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ChallengesService } from "./challenges.service";

@Controller("challenges")
export class ChallengesController {
  constructor(private readonly challengesService: ChallengesService) {}

  @Get()
  active() {
    return { data: this.challengesService.active() };
  }

  @Post(":id/join")
  join(@Param("id") id: string, @Body() body: { userId?: string }) {
    return {
      data: this.challengesService.join(id, body.userId ?? "user_demo")
    };
  }
}
