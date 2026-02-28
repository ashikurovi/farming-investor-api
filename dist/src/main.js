"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const path_1 = require("path");
const common_1 = require("@nestjs/common");
const all_exceptions_filter_1 = require("./common/filters/all-exceptions.filter");
const compression_1 = __importDefault(require("compression"));
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
        app.useGlobalPipes(new common_1.ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }));
        app.useGlobalFilters(new all_exceptions_filter_1.AllExceptionsFilter());
        app.use((0, compression_1.default)());
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