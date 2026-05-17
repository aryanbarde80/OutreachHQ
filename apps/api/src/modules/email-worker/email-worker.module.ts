import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CampaignsModule } from '../campaigns/campaigns.module';
import { Campaign, CampaignSchema } from '../campaigns/schemas/campaign.schema';
import { EmailAccountsModule } from '../email-accounts/email-accounts.module';
import { EmailLogsModule } from '../email-logs/email-logs.module';
import { LeadsModule } from '../leads/leads.module';
import { Lead, LeadSchema } from '../leads/schemas/lead.schema';
import { QueueModule } from '../queue/queue.module';
import { ResumesModule } from '../resumes/resumes.module';
import { EmailQueueWorkerService } from './email-queue-worker.service';
import { MailDispatchService } from './mail-dispatch.service';
import { TemplateService } from './template.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Campaign.name, schema: CampaignSchema },
      { name: Lead.name, schema: LeadSchema },
    ]),
    EmailAccountsModule,
    EmailLogsModule,
    LeadsModule,
    ResumesModule,
    forwardRef(() => CampaignsModule),
    QueueModule,
  ],
  providers: [EmailQueueWorkerService, MailDispatchService, TemplateService],
  exports: [MailDispatchService, TemplateService],
})
export class EmailWorkerModule {}

