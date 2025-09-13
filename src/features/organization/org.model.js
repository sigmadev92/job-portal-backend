import mongoose from "mongoose";

const orgSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  orgType: {
    type: String,
    required: true,
  },
  email: {
    required: true,
    type: String,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  sector: {
    type: String,
    required: true,
  },
  industry: {
    type: String,
    required: true,
  },
});

const Orgs = mongoose.model("Org", orgSchema);
export default Orgs;
