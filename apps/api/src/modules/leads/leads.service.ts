import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { parse } from 'csv-parse/sync';
import { Model, Types } from 'mongoose';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { Lead, LeadDocument } from './schemas/lead.schema';

@Injectable()
export class LeadsService {
  constructor(@InjectModel(Lead.name) private readonly leadModel: Model<LeadDocument>) {}

  create(userId: string, dto: CreateLeadDto) {
    return this.leadModel.create({
      ...dto,
      email: dto.email.toLowerCase(),
      userId: new Types.ObjectId(userId),
      tags: dto.tags ?? [],
    });
  }

  findAll(userId: string, query: { tag?: string; segment?: string; search?: string }) {
    const filter: Record<string, unknown> = { userId: new Types.ObjectId(userId) };
    if (query.tag) {
      filter.tags = query.tag;
    }
    if (query.segment) {
      filter.segment = query.segment;
    }
    if (query.search) {
      filter.$or = [
        { email: new RegExp(query.search, 'i') },
        { name: new RegExp(query.search, 'i') },
        { company: new RegExp(query.search, 'i') },
      ];
    }
    return this.leadModel.find(filter).sort({ createdAt: -1 }).limit(500).exec();
  }

  update(userId: string, leadId: string, dto: UpdateLeadDto) {
    return this.leadModel
      .findOneAndUpdate(
        { _id: leadId, userId: new Types.ObjectId(userId) },
        { ...dto, ...(dto.email ? { email: dto.email.toLowerCase() } : {}) },
        { new: true },
      )
      .exec();
  }

  async importCsv(userId: string, file: any) {
    if (!file) {
      throw new BadRequestException('CSV file is required');
    }

    const rows = parse(file.buffer, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    }) as Record<string, string>[];

    const documents = rows
      .map((row) => ({
        userId: new Types.ObjectId(userId),
        email: row.email?.toLowerCase(),
        name: row.name || undefined,
        company: row.company || undefined,
        jobTitle: row.jobTitle || row.role || undefined,
        segment: row.segment || undefined,
        tags: (row.tags || '')
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
        metadata: row,
      }))
      .filter((item) => item.email);

    if (!documents.length) {
      throw new BadRequestException('No valid rows found in CSV');
    }

    const result = await this.leadModel.bulkWrite(
      documents.map((lead) => ({
        updateOne: {
          filter: { userId: lead.userId, email: lead.email },
          update: { $set: lead },
          upsert: true,
        },
      })),
      { ordered: false },
    );

    return {
      imported: result.upsertedCount + result.modifiedCount,
      totalRows: rows.length,
    };
  }

  findByIds(userId: string, leadIds: string[]) {
    return this.leadModel
      .find({
        userId: new Types.ObjectId(userId),
        _id: { $in: leadIds.map((id) => new Types.ObjectId(id)) },
      })
      .exec();
  }

  markContacted(leadId: string) {
    return this.leadModel
      .findByIdAndUpdate(leadId, { status: 'CONTACTED', lastContactedAt: new Date() }, { new: true })
      .exec();
  }
}
