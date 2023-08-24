import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    name: { type: String },
    type: { type: String },
    start: { type: String },
    distance: { type: String },
    speed: { type: String },
    id: { type: String },
    location: { type: String },
    email : {type: String}
  },
  {
    timestamps: true,
  }
);

export const Activity =
  mongoose.models.Activity || mongoose.model("Activity", activitySchema);
