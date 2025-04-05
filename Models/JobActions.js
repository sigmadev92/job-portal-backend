import mongoose from "mongoose";

const JobActionSchema = mongoose.Schema(
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

const JobActions = mongoose.model("jobactions", JobActionSchema);

export default JobActions;
