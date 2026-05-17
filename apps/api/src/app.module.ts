import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import envConfiguration from './config/env.configuration';
import { validate } from './config/validation';
import { AuthModule } from './modules/auth/auth.module';
import { CampaignsModule } from './modules/campaigns/campaigns.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { EmailAccountsModule } from './modules/email-accounts/email-accounts.module';
import { EmailLogsModule } from './modules/email-logs/email-logs.module';
import { EmailWorkerModule } from './modules/email-worker/email-worker.module';
import { LeadsModule } from './modules/leads/leads.module';
import { QueueModule } from './modules/queue/queue.module';
import { ResumesModule } from './modules/resumes/resumes.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [envConfiguration],
      validate,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.getOrThrow<string>('app.mongoUri'),
      }),
    }),
    UsersModule,
    AuthModule,
    LeadsModule,
    EmailAccountsModule,
    ResumesModule,
    EmailLogsModule,
    QueueModule,
    EmailWorkerModule,
    CampaignsModule,
    DashboardModule,
  ],
})
export class AppModule {}
