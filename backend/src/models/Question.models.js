import mongoose, { Schema } from "mongoose";
const questionSchema = new Schema(
  {
    questionText: {
      type: String,
      required: true,
      trim: true,
    },
    options: {
      type: [String],
      required: [true],
      validate: [
        (val) => val.length === 4,
        "question must have exact 4 options",
      ],
    },
    correctAnswer: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
      unique: true,
      enum: ["OS", "DSA", "COA", "APTI", "DBMS"],
      index: true,
    },
    difficulties: {
      type: String,
      required: true,
      enum: ["EASY", "MEDIUM", "HARD"],
      default: "MEDIUM",
    },
  },
  { timestamps: true },
);

export const Question = mongoose.model("Question", questionSchema);
