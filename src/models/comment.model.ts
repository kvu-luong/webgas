import { Schema, model, Document } from 'mongoose';

const DOCUMENT_NAME = 'Comment';
const COLLECTION_NAME = 'Comments';

export interface IComment extends Document {
  productId: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  content: string;
  left: number;
  right: number;
  parentId: Schema.Types.ObjectId;
  isDeleted: boolean;
  default: false;
}

const commentSchema = new Schema<IComment>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    userId: { type: Schema.Types.ObjectId },
    content: { type: String, default: 'text' },
    left: { type: Number, default: 0 },
    right: { type: Number, default: 0 },
    parentId: { type: Schema.Types.ObjectId },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  },
);

export default model<IComment & Document>(DOCUMENT_NAME, commentSchema);
