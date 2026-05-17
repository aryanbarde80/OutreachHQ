import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ResumeDocument = HydratedDocument<Resume>;

@Schema({ timestamps: true })
export class Resume {
  @Prop({ type: Types.ObjectId, required: true, index: true })
  userId!: Types.ObjectId;

  @Prop({ required: true })
  title!: string;

  @Prop({ required: true })
  filename!: string;

  @Prop({ required: true })
  filePath!: string;

  @Prop()
  parsedText?: string;

  @Prop({ type: [String], default: [] })
  keywords!: string[];

  @Prop({ type: [String], default: [] })
  tags!: string[];

  @Prop({ default: false })
  isDefault!: boolean;

  @Prop()
  mimeType?: string;

  @Prop()
  size?: number;
}

export const ResumeSchema = SchemaFactory.createForClass(Resume);

