import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MongoIdInterceptor } from './common/interceptors/mongo-id.interceptor';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  // Start the worker context if enabled
  if (process.env.ENABLE_EMAIL_WORKER === 'true') {
    console.log('Starting Email Worker context...');
    NestFactory.createApplicationContext(AppModule).then(() => {
      console.log('Email Worker context started successfully');
    }).catch(err => {
      console.error('Failed to start Email Worker context:', err);
    });
  }

  const app = await NestFactory.create(AppModule);
  
  // Set global prefix for API routes to avoid collision with frontend
  app.setGlobalPrefix('api');

  app.enableCors({
    origin: process.env.CLIENT_ORIGIN ?? '*',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useGlobalInterceptors(new MongoIdInterceptor());

  // Serve static files from the frontend build
  const webDistPath = join(__dirname, '../../web/dist');
  app.use(express.static(webDistPath));

  // Handle SPA routing: serve index.html for any non-API routes
  app.use((req: any, res: any, next: any) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(join(webDistPath, 'index.html'));
  });

  const port = Number(process.env.PORT ?? process.env.API_PORT ?? 4000);
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}

bootstrap();
