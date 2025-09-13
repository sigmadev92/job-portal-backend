import mongoose from "mongoose";

const applySchema = new mongoose.Schema(
  {
    JobId: {
      type: String,
      required: true,
    },
    UserId: {
      type: String,
      required: true,
    },

    ActionType: {
      type: String,
      required: true,
    },
  },
  { timestams: true }
);

const Applications = mongoose.model("jobactions", applySchema);

export default Applications;
