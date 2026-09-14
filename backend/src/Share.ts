import mongoose, { Schema, Document } from "mongoose";

export interface IShare extends Document {
  shareId: string;
  contentId?: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  type: "note" | "brain";
  createdAt: Date;
}

const ShareSchema = new Schema<IShare>(
  {
    shareId: {
      type: String,
      required: true,
      unique: true,
    },

    contentId: {
      type: Schema.Types.ObjectId,
      ref: "Content",
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      enum: ["note", "brain"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const ShareModel = mongoose.model<IShare>("Share", ShareSchema);