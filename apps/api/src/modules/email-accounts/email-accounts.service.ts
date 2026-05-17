import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateEmailAccountDto } from './dto/create-email-account.dto';
import { UpdateEmailAccountDto } from './dto/update-email-account.dto';
import { EmailAccount, EmailAccountDocument } from './schemas/email-account.schema';

@Injectable()
export class EmailAccountsService {
  constructor(
    @InjectModel(EmailAccount.name) private readonly emailAccountModel: Model<EmailAccountDocument>,
  ) {}

  create(userId: string, dto: CreateEmailAccountDto) {
    return this.emailAccountModel.create({
      ...dto,
      fromEmail: dto.fromEmail.toLowerCase(),
      userId: new Types.ObjectId(userId),
      active: true,
      sentToday: 0,
      usageResetAt: new Date(),
    });
  }

  findAll(userId: string) {
    return this.emailAccountModel.find({ userId: new Types.ObjectId(userId) }).sort({ active: -1 }).exec();
  }

  update(userId: string, accountId: string, dto: UpdateEmailAccountDto) {
    return this.emailAccountModel
      .findOneAndUpdate(
        { _id: accountId, userId: new Types.ObjectId(userId) },
        dto,
        { new: true },
      )
      .exec();
  }

  async findAvailableAccount(userId: string, accountIds: string[]) {
    const now = new Date();
    const accounts = await this.emailAccountModel
      .find({
        userId: new Types.ObjectId(userId),
        _id: { $in: accountIds.map((id) => new Types.ObjectId(id)) },
        active: true,
      })
      .sort({ sentToday: 1, lastSentAt: 1 })
      .exec();

    for (const account of accounts) {
      const needsReset =
        !account.usageResetAt ||
        account.usageResetAt.toDateString() !== now.toDateString();
      if (needsReset) {
        account.sentToday = 0;
        account.usageResetAt = now;
        await account.save();
      }
      if (account.sentToday < account.dailyLimit) {
        return account;
      }
    }
    return null;
  }

  async incrementUsage(accountId: string) {
    await this.emailAccountModel.findByIdAndUpdate(accountId, {
      $inc: { sentToday: 1 },
      $set: { lastSentAt: new Date() },
    });
  }
}

