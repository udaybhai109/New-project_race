import "reflect-metadata";

import { NestFactory } from "@nestjs/core";
import { LeaderboardModule } from "./leaderboard.module";

async function bootstrap() {
  const app = await NestFactory.create(LeaderboardModule, { cors: true });
  await app.listen(4303);
}

void bootstrap();

