import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CampaignDocument = HydratedDocument<Campaign>;

@Schema({ timestamps: true })
export class Campaign {
  @Prop({ type: Types.ObjectId, required: true, index: true })
  userId!: Types.ObjectId;

  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  subject!: string;

  @Prop({ required: true })
  htmlTemplate!: string;

  @Prop({ type: [Types.ObjectId], default: [] })
  leadIds!: Types.ObjectId[];

  @Prop({ type: [Types.ObjectId], default: [] })
  senderAccountIds!: Types.ObjectId[];

  @Prop({ type: [String], default: [] })
  resumeKeywords!: string[];

  @Prop({ default: 120000 })
  delayMs!: number;

  @Prop()
  scheduledAt?: Date;

  @Prop({ default: false })
  followUpEnabled!: boolean;

  @Prop({ default: 72 })
  followUpDelayHours!: number;

  @Prop({ default: 1 })
  maxFollowUps!: number;

  @Prop({ default: 'DRAFT' })
  status!: 'DRAFT' | 'SCHEDULED' | 'RUNNING' | 'COMPLETED' | 'PAUSED';

  @Prop({ default: 0 })
  totalLeads!: number;

  @Prop({ default: 0 })
  sentCount!: number;

  @Prop({ default: 0 })
  failedCount!: number;
}

export const CampaignSchema = SchemaFactory.createForClass(Campaign);

