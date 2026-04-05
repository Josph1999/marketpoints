import mongoose, { Schema, Document } from 'mongoose';

export interface ICard extends Document {
  userId: mongoose.Types.ObjectId;
  cardNumber: string;
  name: string;
  designId: string;
  createdAt: Date;
}

const CardSchema = new Schema<ICard>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    cardNumber: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      maxlength: 30,
    },
    designId: {
      type: String,
      required: true,
      default: 'midnight',
    },
  },
  { timestamps: true }
);

export default mongoose.models.Card || mongoose.model<ICard>('Card', CardSchema);
