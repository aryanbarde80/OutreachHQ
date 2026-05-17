import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { EmailLog, EmailLogDocument } from './schemas/email-log.schema';

@Injectable()
export class EmailLogsService {
  constructor(@InjectModel(EmailLog.name) private readonly emailLogModel: Model<EmailLogDocument>) {}

  createPending(payload: {
    userId: string;
    campaignId: string;
    leadId: string;
    recipient: string;
    subject: string;
    step?: number;
  }) {
    return this.emailLogModel.findOneAndUpdate(
      {
        campaignId: new Types.ObjectId(payload.campaignId),
        leadId: new Types.ObjectId(payload.leadId),
        step: payload.step ?? 0,
      },
      {
        $setOnInsert: {
          userId: new Types.ObjectId(payload.userId),
          campaignId: new Types.ObjectId(payload.campaignId),
          leadId: new Types.ObjectId(payload.leadId),
          recipient: payload.recipient,
          subject: payload.subject,
          status: 'PENDING',
          queuedAt: new Date(),
          step: payload.step ?? 0,
          attempt: 0,
        },
      },
      { new: true, upsert: true },
    );
  }

  markSent(logId: string, accountId: string, messageId?: string) {
    return this.emailLogModel.findByIdAndUpdate(
      logId,
      {
        status: 'SENT',
        emailAccountId: new Types.ObjectId(accountId),
        sentAt: new Date(),
        providerMessageId: messageId,
        errorMessage: undefined,
      },
      { new: true },
    );
  }

  markFailed(logId: string, errorMessage: string, attempt: number) {
    return this.emailLogModel.findByIdAndUpdate(
      logId,
      {
        status: 'FAILED',
        errorMessage,
        attempt,
      },
      { new: true },
    );
  }

  incrementAttempt(logId: string) {
    return this.emailLogModel.findByIdAndUpdate(logId, { $inc: { attempt: 1 } }, { new: true });
  }

  findForCampaign(userId: string, campaignId: string) {
    return this.emailLogModel
      .find({
        userId: new Types.ObjectId(userId),
        campaignId: new Types.ObjectId(campaignId),
      })
      .sort({ createdAt: -1 })
      .limit(1000)
      .exec();
  }

  findAll(userId: string) {
    return this.emailLogModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .limit(1000)
      .exec();
  }

  aggregateCounts(userId: string) {
    return this.emailLogModel.aggregate([
      { $match: { userId: new Types.ObjectId(userId) } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);
  }
}

