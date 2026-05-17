import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type EmailAccountDocument = HydratedDocument<EmailAccount>;

@Schema({ timestamps: true })
export class EmailAccount {
  @Prop({ type: Types.ObjectId, required: true, index: true })
  userId!: Types.ObjectId;

  @Prop({ required: true })
  label!: string;

  @Prop({ required: true })
  provider!: 'gmail' | 'outlook' | 'zoho' | 'custom';

  @Prop({ required: true })
  fromName!: string;

  @Prop({ required: true, lowercase: true })
  fromEmail!: string;

  @Prop({ required: true })
  host!: string;

  @Prop({ required: true })
  port!: number;

  @Prop({ default: false })
  secure!: boolean;

  @Prop({ required: true })
  username!: string;

  @Prop({ required: true })
  password!: string;

  @Prop({ default: true })
  active!: boolean;

  @Prop({ default: 100 })
  dailyLimit!: number;

  @Prop({ default: 0 })
  sentToday!: number;

  @Prop()
  usageResetAt?: Date;

  @Prop()
  lastSentAt?: Date;
}

export const EmailAccountSchema = SchemaFactory.createForClass(EmailAccount);
EmailAccountSchema.index({ userId: 1, fromEmail: 1 }, { unique: true });

