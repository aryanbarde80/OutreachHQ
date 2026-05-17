import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateCampaignDto {
  @IsString()
  name!: string;

  @IsString()
  subject!: string;

  @IsString()
  htmlTemplate!: string;

  @IsArray()
  leadIds!: string[];

  @IsArray()
  senderAccountIds!: string[];

  @IsOptional()
  @IsArray()
  resumeKeywords?: string[];

  @IsOptional()
  @IsInt()
  @Min(1000)
  delayMs?: number;

  @IsOptional()
  @IsDateString()
  scheduledAt?: string;

  @IsOptional()
  @IsBoolean()
  followUpEnabled?: boolean;

  @IsOptional()
  @IsInt()
  @Min(1)
  followUpDelayHours?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  maxFollowUps?: number;
}

