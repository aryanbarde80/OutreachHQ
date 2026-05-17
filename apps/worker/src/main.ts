import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../api/src/app.module';

async function bootstrap() {
  process.env.ENABLE_EMAIL_WORKER = 'true';
  await NestFactory.createApplicationContext(AppModule);
}

bootstrap();
