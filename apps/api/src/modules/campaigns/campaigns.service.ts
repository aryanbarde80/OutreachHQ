import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { EmailLogsService } from '../email-logs/email-logs.service';
import { LeadsService } from '../leads/leads.service';
import { QueueService } from '../queue/queue.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { Campaign, CampaignDocument } from './schemas/campaign.schema';

@Injectable()
export class CampaignsService {
  constructor(
    @InjectModel(Campaign.name) private readonly campaignModel: Model<CampaignDocument>,
    private readonly leadsService: LeadsService,
    private readonly emailLogsService: EmailLogsService,
    private readonly queueService: QueueService,
  ) {}

  findAll(userId: string) {
    return this.campaignModel.find({ userId: new Types.ObjectId(userId) }).sort({ createdAt: -1 }).exec();
  }

  findOne(userId: string, campaignId: string) {
    return this.campaignModel.findOne({ _id: campaignId, userId: new Types.ObjectId(userId) }).exec();
  }

  async create(userId: string, dto: CreateCampaignDto) {
    const leads = await this.leadsService.findByIds(userId, dto.leadIds);
    if (!leads.length) {
      throw new BadRequestException('At least one lead is required');
    }

    const campaign = await this.campaignModel.create({
      userId: new Types.ObjectId(userId),
      name: dto.name,
      subject: dto.subject,
      htmlTemplate: dto.htmlTemplate,
      leadIds: dto.leadIds.map((id) => new Types.ObjectId(id)),
      senderAccountIds: dto.senderAccountIds.map((id) => new Types.ObjectId(id)),
      resumeKeywords: dto.resumeKeywords ?? [],
      delayMs: dto.delayMs ?? 120000,
      scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : undefined,
      followUpEnabled: dto.followUpEnabled ?? false,
      followUpDelayHours: dto.followUpDelayHours ?? 72,
      maxFollowUps: dto.maxFollowUps ?? 1,
      status: dto.scheduledAt ? 'SCHEDULED' : 'RUNNING',
      totalLeads: leads.length,
    });

    for (const lead of leads) {
      await this.emailLogsService.createPending({
        userId,
        campaignId: campaign.id,
        leadId: lead.id,
        recipient: lead.email,
        subject: campaign.subject,
      });
    }

    await this.queueService.enqueueCampaign(campaign, leads);
    return campaign;
  }

  updateCounters(campaignId: string, status: 'SENT' | 'FAILED') {
    return this.campaignModel.findByIdAndUpdate(
      campaignId,
      {
        $inc: status === 'SENT' ? { sentCount: 1 } : { failedCount: 1 },
      },
      { new: true },
    );
  }
}

