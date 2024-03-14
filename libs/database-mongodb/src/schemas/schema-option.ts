import { SchemaOptions } from '@nestjs/mongoose';

export const DefaultSchemaOptions: SchemaOptions = {
  timestamps: true,
  toJSON: {
    transform: function (doc, ret) {
      delete ret._id;
    },
    getters: true,
    virtuals: true,
    versionKey: false,
  },
};

export const EmbeddedSchemaOptions: SchemaOptions = {
  toJSON: {
    transform: function (doc, ret) {
      delete ret._id;
    },
    virtuals: true,
  },
};

