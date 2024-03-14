import { Prop, Schema } from '@nestjs/mongoose';
import { BaseDocument } from './base.document';
import { DefaultSchemaOptions } from './schema-option';

@Schema(DefaultSchemaOptions)
export class CommentDocument extends BaseDocument {
  @Prop({ required: true, type: Number })
  userId: number;

  @Prop({ required: true, type: Number })
  issueId: number;

  @Prop({ required: true, type: String })
  content: string;

  @Prop({ type: [String] })
  files?: string[];
}
