import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type LeadDocument = HydratedDocument<Lead>;

@Schema({ timestamps: true })
export class Lead {
  @Prop({ type: Types.ObjectId, required: true, index: true })
  userId!: Types.ObjectId;

  @Prop({ required: true, lowercase: true, index: true })
  email!: string;

  @Prop()
  name?: string;

  @Prop()
  company?: string;

  @Prop()
  jobTitle?: string;

  @Prop({ type: [String], default: [] })
  tags!: string[];

  @Prop()
  segment?: string;

  @Prop({ default: 'NEW' })
  status!: 'NEW' | 'CONTACTED' | 'REPLIED' | 'BOUNCED';

  @Prop({ type: Object, default: {} })
  metadata!: Record<string, unknown>;

  @Prop()
  lastContactedAt?: Date;
}

export const LeadSchema = SchemaFactory.createForClass(Lead);
LeadSchema.index({ userId: 1, email: 1 }, { unique: true });

