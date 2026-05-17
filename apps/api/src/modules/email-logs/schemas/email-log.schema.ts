import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type EmailLogDocument = HydratedDocument<EmailLog>;

@Schema({ timestamps: true })
export class EmailLog {
  @Prop({ type: Types.ObjectId, required: true, index: true })
  userId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, index: true })
  campaignId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, index: true })
  leadId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId })
  emailAccountId?: Types.ObjectId;

  @Prop({ required: true })
  recipient!: string;

  @Prop({ required: true })
  subject!: string;

  @Prop({ default: 'PENDING' })
  status!: 'PENDING' | 'SENT' | 'FAILED';

  @Prop()
  errorMessage?: string;

  @Prop({ default: 0 })
  attempt!: number;

  @Prop({ default: 0 })
  step!: number;

  @Prop()
  queuedAt?: Date;

  @Prop()
  sentAt?: Date;

  @Prop()
  providerMessageId?: string;
}

export const EmailLogSchema = SchemaFactory.createForClass(EmailLog);
EmailLogSchema.index({ campaignId: 1, leadId: 1, step: 1 }, { unique: true });

