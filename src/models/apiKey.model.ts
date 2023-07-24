import { Schema, model, Document } from 'mongoose';

export interface IApiKey {
  key: string;
  status?: boolean;
  permissions: string[];
  createdAt: Date;
}

const DOCUMENT_NAME = 'ApiKey';
const COLLECTION_NAME = 'ApiKeys';

const apiKeySchema = new Schema<IApiKey>(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    permissions: {
      type: [String],
      required: true,
      enum: ['super_star', 'vip', 'normal'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: '30d',
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

export default model<IApiKey & Document>(DOCUMENT_NAME, apiKeySchema);
