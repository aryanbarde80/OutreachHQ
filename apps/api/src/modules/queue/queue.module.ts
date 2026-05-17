import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Queue } from 'bullmq';
import IORedis from 'ioredis';
import { EMAIL_SEND_QUEUE } from './queue.constants';
import { QueueService } from './queue.service';

@Module({
  providers: [
    {
      provide: 'REDIS_CONNECTION',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        new IORedis({
          host: configService.getOrThrow<string>('app.redis.host'),
          port: configService.getOrThrow<number>('app.redis.port'),
          password: configService.get<string>('app.redis.password'),
          maxRetriesPerRequest: null,
        }),
    },
    {
      provide: EMAIL_SEND_QUEUE,
      inject: ['REDIS_CONNECTION'],
      useFactory: (connection: IORedis) =>
        new Queue(EMAIL_SEND_QUEUE, {
          connection,
          defaultJobOptions: {
            attempts: 3,
          },
        }),
    },
    QueueService,
  ],
  exports: ['REDIS_CONNECTION', EMAIL_SEND_QUEUE, QueueService],
})
export class QueueModule {}
