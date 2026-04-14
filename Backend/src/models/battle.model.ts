import mongoose, { type Document, Schema } from "mongoose";

export interface IBattle extends Document {
  userId: mongoose.Types.ObjectId;
  problem: string;
  modelA: string;
  modelB: string;
  responseA: string;
  responseB: string;
  scoreA: number;
  scoreB: number;
  winner: string;
  reasoningA: string;
  reasoningB: string;
  createdAt: Date;
}

const battleSchema = new Schema<IBattle>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      index: true,
    },
    problem: {
      type: String,
      required: [true, "Problem statement is required"],
      trim: true,
      minlength: [5, "Problem must be at least 5 characters"],
    },
    modelA: {
      type: String,
      required: [true, "Model A is required"],
      trim: true,
    },
    modelB: {
      type: String,
      required: [true, "Model B is required"],
      trim: true,
    },
    responseA: {
      type: String,
      default: "",
    },
    responseB: {
      type: String,
      default: "",
    },
    scoreA: {
      type: Number,
      default: 0,
      min: 0,
      max: 10,
    },
    scoreB: {
      type: Number,
      default: 0,
      min: 0,
      max: 10,
    },
    winner: {
      type: String,
      default: "",
    },
    reasoningA: {
      type: String,
      default: "",
    },
    reasoningB: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient user battle history queries
battleSchema.index({ userId: 1, createdAt: -1 });

const Battle = mongoose.model<IBattle>("Battle", battleSchema);

export default Battle;
