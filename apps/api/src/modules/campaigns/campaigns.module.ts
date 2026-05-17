import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailLogsModule } from '../email-logs/email-logs.module';
import { LeadsModule } from '../leads/leads.module';
import { QueueModule } from '../queue/queue.module';
import { CampaignsController } from './campaigns.controller';
import { CampaignsService } from './campaigns.service';
import { Campaign, CampaignSchema } from './schemas/campaign.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Campaign.name, schema: CampaignSchema }]),
    LeadsModule,
    EmailLogsModule,
    forwardRef(() => QueueModule),
  ],
  controllers: [CampaignsController],
  providers: [CampaignsService],
  exports: [CampaignsService, MongooseModule],
})
export class CampaignsModule {}

