import "reflect-metadata";

import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.setGlobalPrefix("api");
  app.use((req, _res, next) => {
    console.log(`[REQ] ${req.method} ${req.originalUrl ?? req.url}`);
    next();
  });

  const port = process.env.PORT ? Number(process.env.PORT) : 4000;
  await app.listen(port);
  console.log(`Server running on http://localhost:${port}`);
}

void bootstrap();
