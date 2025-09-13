import mongoose from "mongoose";
const UserSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      required: true,
      enum: ["IR", "Rec", "HR", "C", "S"],
      // IR = Independent Recruiter
      // Rec = works in a company hiring for other companies
      // HR - works and hires for single Company
      // C - candidate looking for job
      // S - Student
    },
    name: {
      fname: {
        type: String,
        required: true,
        minlength: 2,
      },
      lname: {
        type: String,
        required: true,
        minlength: 2,
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    isMailVerified: {
      type: Boolean,
      required: true,
      default: false,
    },
    password: {
      type: String,
      required: true,
    },

    profilePic: {
      type: String,
      required: true,
    },
    user_id: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: function () {
        return this.role !== "Org";
      },
      enum: ["M", "F", "NTS"],
    },

    dob: {
      //this will be year of establishment for Orgs
      type: Date,
      required: true,
    },

    resume: {
      type: String,
      required: function () {
        return this.role !== "Org";
      },
    },

    companyName: {
      type: String,
      required: function () {
        return this.UserType === "HR";
      },
    },
    Position: {
      type: String,
      required: function () {
        return this.UserType === "recruiter";
      },
    },
    education: { type: String },
    experience: {
      type: Number,
    },
    about: {
      type: String,
    },
  },
  { timestamps: true }
);
const Users = mongoose.model("Users", UserSchema);
export default Users;
