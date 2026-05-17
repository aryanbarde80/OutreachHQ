import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import * as fs from 'fs';
import * as path from 'path';
import { Model, Types } from 'mongoose';
import pdfParse from 'pdf-parse';
import { CreateResumeDto } from './dto/create-resume.dto';
import { Resume, ResumeDocument } from './schemas/resume.schema';

@Injectable()
export class ResumesService {
  private readonly uploadDir: string;

  constructor(
    @InjectModel(Resume.name) private readonly resumeModel: Model<ResumeDocument>,
    configService: ConfigService,
  ) {
    this.uploadDir = path.resolve(configService.getOrThrow<string>('app.uploadDir'), 'resumes');
    fs.mkdirSync(this.uploadDir, { recursive: true });
  }

  async create(userId: string, dto: CreateResumeDto, file: any) {
    if (!file || file.mimetype !== 'application/pdf') {
      throw new BadRequestException('PDF resume is required');
    }
    const safeName = `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`;
    const filePath = path.join(this.uploadDir, safeName);
    fs.writeFileSync(filePath, file.buffer);
    const parsed = await pdfParse(file.buffer);

    if (dto.isDefault) {
      await this.resumeModel.updateMany({ userId: new Types.ObjectId(userId) }, { isDefault: false });
    }

    return this.resumeModel.create({
      userId: new Types.ObjectId(userId),
      title: dto.title,
      filename: file.originalname,
      filePath,
      parsedText: parsed.text,
      keywords: dto.keywords ?? [],
      tags: dto.tags ?? [],
      isDefault: dto.isDefault ?? false,
      mimeType: file.mimetype,
      size: file.size,
    });
  }

  findAll(userId: string) {
    return this.resumeModel.find({ userId: new Types.ObjectId(userId) }).sort({ isDefault: -1 }).exec();
  }

  async chooseResume(userId: string, requestedKeywords: string[] = [], leadContext?: string) {
    const resumes = await this.resumeModel.find({ userId: new Types.ObjectId(userId) }).exec();
    if (!resumes.length) {
      return null;
    }

    const searchText = `${requestedKeywords.join(' ')} ${leadContext ?? ''}`.toLowerCase();
    const scored = resumes
      .map((resume) => ({
        resume,
        score: resume.keywords.reduce(
          (total, keyword) => total + (searchText.includes(keyword.toLowerCase()) ? 2 : 0),
          resume.isDefault ? 1 : 0,
        ),
      }))
      .sort((a, b) => b.score - a.score);

    return scored[0].resume;
  }
}
