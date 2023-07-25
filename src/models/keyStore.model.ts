import { Schema, model, Document } from 'mongoose';

export interface IKeyStore {
  user: Schema.Types.ObjectId;
  refreshToken: string;
  refreshTokensUsed: string[];
}

const DOCUMENT_NAME = 'KeyStore';
const COLLECTION_NAME = 'KeyStores';

const keyStoreSchema = new Schema<IKeyStore>(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Shop',
    },
    refreshToken: {
      type: String,
      required: true,
    },
    refreshTokensUsed: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

export default model<IKeyStore & Document>(DOCUMENT_NAME, keyStoreSchema);
