import { Prop, Schema } from '@nestjs/mongoose';
import { BaseDocument } from './base.document';
import { DefaultSchemaOptions } from './schema-option';

enum ChatType {
  OneOnOne = '1v1',
  Group = 'group',
}

@Schema(DefaultSchemaOptions)
export class ChatDocument extends BaseDocument {
  @Prop({ required: true, type: Number })
  userId: number;

  @Prop({ type: Number, required: function(this: ChatDocument) {
    return this.type === ChatType.OneOnOne;
  } })
  receiverId?: number;

  @Prop({ type: Number, required: function(this: ChatDocument) {
    return this.type === ChatType.Group;
  } })
  groupId?: number;

  @Prop({ required: true, type: String })
  content: string;

  @Prop({ type: [String] })
  files?: string[];

  @Prop({ required: true, type: String, enum: ChatType })
  type: ChatType;
}
