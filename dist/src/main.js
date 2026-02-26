"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const path_1 = require("path");
let cachedApp;
async function bootstrap() {
    if (!cachedApp) {
        const app = await core_1.NestFactory.create(app_module_1.AppModule, {
            logger: ['error', 'warn'],
        });
        app.enableCors({
            origin: true,
            credentials: false,
        });
        await app.init();
        app.useStaticAssets((0, path_1.join)(process.cwd(), 'uploads'), { prefix: '/uploads/' });
        cachedApp = app;
    }
    return cachedApp;
}
if (!process.env.VERCEL) {
    async function startLocalServer() {
        const app = await bootstrap();
        const port = 8000;
        await app.listen(port);
        console.log(`🚀 Server is running on: http://localhost:${port}`);
    }
    startLocalServer();
}
async function handler(req, res) {
    const app = await bootstrap();
    app.getHttpAdapter().getInstance()(req, res);
}
//# sourceMappingURL=main.js.map