"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, { cors: true });
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
//# sourceMappingURL=main.js.map