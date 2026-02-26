// main.ts

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { join } from 'path';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';



// --- VERCEL HANDLER & CACHING LOGIC ---

// Cache the initialized NestJS application instance
let cachedApp: NestExpressApplication;

async function bootstrap(): Promise<NestExpressApplication> {
    if (!cachedApp) {
        // 1. Create the NestJS application
        const app = await NestFactory.create<NestExpressApplication>(AppModule, {
            logger: ['error', 'warn'], // Optimize logging for production
        });
  app.enableCors({
  origin: true, // ✅ সব domain allow
  credentials: false, // optional: cookie/credential নেই
});

        app.useGlobalPipes(
          new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
          }),
        );

        app.useGlobalFilters(new AllExceptionsFilter());
        // 3. Initialize the app to finalize middleware and routing
        await app.init();
     
        app.useStaticAssets(join(process.cwd(), 'uploads'), { prefix: '/uploads/' });
        cachedApp = app;
    }
    return cachedApp;
}

// --- LOCAL SERVER START (For Development) ---

// Start server locally if not on Vercel
if (!process.env.VERCEL) {
    async function startLocalServer() {
        // Re-use the bootstrap logic for consistency, but start listening
        const app = await bootstrap(); 
        const port = 8000;
        await app.listen(port);
        console.log(`🚀 Server is running on: http://localhost:${port}`);
    }
    startLocalServer();
}

// --- VERCEL ENTRY POINT ---
export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Get the cached application instance
    const app = await bootstrap();

    // Extract the native Express handler and execute the request
    app.getHttpAdapter().getInstance()(req, res);
}