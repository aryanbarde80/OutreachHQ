import { Inject, Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Worker } from 'bullmq';
import IORedis from 'ioredis';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Campaign, CampaignDocument } from '../campaigns/schemas/campaign.schema';
import { CampaignsService } from '../campaigns/campaigns.service';
import { EmailAccountsService } from '../email-accounts/email-accounts.service';
import { EmailLogsService } from '../email-logs/email-logs.service';
import { Lead, LeadDocument } from '../leads/schemas/lead.schema';
import { LeadsService } from '../leads/leads.service';
import { QueueService } from '../queue/queue.service';
import { EMAIL_SEND_QUEUE, EmailSendJob } from '../queue/queue.constants';
import { ResumesService } from '../resumes/resumes.service';
import { MailDispatchService } from './mail-dispatch.service';
import { TemplateService } from './template.service';

@Injectable()
export class EmailQueueWorkerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(EmailQueueWorkerService.name);
  private worker?: Worker<EmailSendJob>;

  constructor(
    @Inject('REDIS_CONNECTION') private readonly redisConnection: IORedis,
    @InjectModel(Campaign.name) private readonly campaignModel: Model<CampaignDocument>,
    @InjectModel(Lead.name) private readonly leadModel: Model<LeadDocument>,
    private readonly emailAccountsService: EmailAccountsService,
    private readonly emailLogsService: EmailLogsService,
    private readonly campaignsService: CampaignsService,
    private readonly leadsService: LeadsService,
    private readonly resumesService: ResumesService,
    private readonly mailDispatchService: MailDispatchService,
    private readonly queueService: QueueService,
    private readonly templateService: TemplateService,
  ) {}

  onModuleInit() {
    if (process.env.ENABLE_EMAIL_WORKER !== 'true') {
      this.logger.log('Email worker disabled for this process');
      return;
    }

    this.worker = new Worker(
      EMAIL_SEND_QUEUE,
      async (job) => this.processJob(job.data),
      { connection: this.redisConnection, concurrency: 5 },
    );
  }

  async onModuleDestroy() {
    await this.worker?.close();
  }

  private async processJob(job: EmailSendJob) {
    const campaign = await this.campaignModel.findById(job.campaignId);
    const lead = await this.leadModel.findById(job.leadId);
    if (!campaign || !lead) {
      return;
    }

    const account = await this.emailAccountsService.findAvailableAccount(
      campaign.userId.toString(),
      campaign.senderAccountIds.map((id) => id.toString()),
    );

    if (!account) {
      this.logger.warn(`No active account available for campaign ${campaign.id}`);
      await this.queueService.enqueueFollowUp(job, 60 * 60 * 1000);
      return;
    }

    const log = await this.emailLogsService.createPending({
      userId: campaign.userId.toString(),
      campaignId: campaign.id,
      leadId: lead.id,
      recipient: lead.email,
      subject: campaign.subject,
      step: job.step,
    });

    try {
      const resume = await this.resumesService.chooseResume(
        campaign.userId.toString(),
        campaign.resumeKeywords,
        `${lead.jobTitle ?? ''} ${lead.company ?? ''}`,
      );
      const html = this.templateService.render(campaign.htmlTemplate, {
        name: lead.name,
        company: lead.company,
      });
      const result = await this.mailDispatchService.sendEmail({
        account,
        to: lead.email,
        subject: campaign.subject,
        html,
        attachment: resume ? { filename: resume.filename, path: resume.filePath } : undefined,
      });
      await this.emailAccountsService.incrementUsage(account.id);
      await this.emailLogsService.markSent(log.id, account.id, result.messageId);
      await this.campaignsService.updateCounters(campaign.id, 'SENT');
      await this.leadsService.markContacted(lead.id);

      if (campaign.followUpEnabled && job.step < campaign.maxFollowUps) {
        await this.emailLogsService.createPending({
          userId: campaign.userId.toString(),
          campaignId: campaign.id,
          leadId: lead.id,
          recipient: lead.email,
          subject: campaign.subject,
          step: job.step + 1,
        });
        await this.queueService.enqueueFollowUp(
          {
            ...job,
            step: job.step + 1,
          },
          campaign.followUpDelayHours * 60 * 60 * 1000,
        );
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown SMTP failure';
      await this.emailLogsService.markFailed(log.id, message, (log.attempt ?? 0) + 1);
      await this.campaignsService.updateCounters(campaign.id, 'FAILED');
      throw error;
    }
  }
}

