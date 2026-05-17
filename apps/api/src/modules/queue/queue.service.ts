import { Inject, Injectable, Logger, forwardRef } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Queue } from 'bullmq';
import { Types } from 'mongoose';
import { CampaignDocument } from '../campaigns/schemas/campaign.schema';
import { LeadDocument } from '../leads/schemas/lead.schema';
import { EMAIL_SEND_QUEUE, EmailSendJob } from './queue.constants';

@Injectable()
export class QueueService {
  private readonly logger = new Logger(QueueService.name);

  constructor(
    @Inject(EMAIL_SEND_QUEUE) private readonly emailSendQueue: Queue<EmailSendJob>,
    private readonly configService: ConfigService,
  ) {}

  async enqueueCampaign(campaign: CampaignDocument, leads: LeadDocument[]) {
    const scheduledAt = campaign.scheduledAt ? new Date(campaign.scheduledAt).getTime() : Date.now();

    for (const [index, lead] of leads.entries()) {
      const logId = new Types.ObjectId().toString();
      await this.emailSendQueue.add(
        `${campaign.id}-${lead.id}-step0`,
        {
          userId: campaign.userId.toString(),
          campaignId: campaign.id,
          leadId: lead.id,
          logId,
          step: 0,
        },
        {
          jobId: `${campaign.id}-${lead.id}-step0`,
          attempts: 3,
          backoff: { type: 'exponential', delay: 60000 },
          delay: Math.max(scheduledAt - Date.now(), 0) + index * campaign.delayMs,
          removeOnComplete: 1000,
          removeOnFail: 1000,
        },
      );
    }

    this.logger.log(`Queued ${leads.length} jobs for campaign ${campaign.id}`);
  }

  async enqueueFollowUp(job: EmailSendJob, delayMs: number) {
    await this.emailSendQueue.add(
      `${job.campaignId}-${job.leadId}-step${job.step}`,
      job,
      {
        jobId: `${job.campaignId}-${job.leadId}-step${job.step}`,
        attempts: 3,
        backoff: { type: 'exponential', delay: 60000 },
        delay: delayMs,
        removeOnComplete: 1000,
        removeOnFail: 1000,
      },
    );
  }
}

