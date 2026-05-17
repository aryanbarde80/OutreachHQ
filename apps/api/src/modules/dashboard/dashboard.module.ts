import { Module } from '@nestjs/common';
import { CampaignsModule } from '../campaigns/campaigns.module';
import { EmailAccountsModule } from '../email-accounts/email-accounts.module';
import { EmailLogsModule } from '../email-logs/email-logs.module';
import { LeadsModule } from '../leads/leads.module';
import { DashboardController } from './dashboard.controller';

@Module({
  imports: [CampaignsModule, EmailAccountsModule, EmailLogsModule, LeadsModule],
  controllers: [DashboardController],
})
export class DashboardModule {}
