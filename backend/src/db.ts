import "dotenv/config";
import mongoose, { Schema, model } from "mongoose";

const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
  throw new Error("MONGO_URI is not defined");
}

export const connectDB = async () => {
  try {
    await mongoose.connect(mongoUri);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const ContentSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    link: {
      type: String,
      required: true,
    },
    tags: [
      {
        type: Schema.Types.ObjectId,
        ref: "Tag",
      },
    ],
    type: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const LinkSchema = new Schema(
  {
    hash: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

export const UserModel = model("User", UserSchema);
export const ContentModel = model("Content", ContentSchema);
export const LinkModel = model("Links", LinkSchema);