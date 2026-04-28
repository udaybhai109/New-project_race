import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { FeedModule } from "./feed.module";
async function bootstrap() {
    const app = await NestFactory.create(FeedModule, { cors: true });
    await app.listen(4304);
}
void bootstrap();
//# sourceMappingURL=main.js.map