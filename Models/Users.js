import mongoose from "mongoose";
const UserSchema = mongoose.Schema(
  {
    isTestData: {
      type: Boolean,
      default: false,
    },
    UserType: {
      type: String,
      required: true,
    },
    FullName: {
      type: String,
      required: true,
    },
    Email: {
      type: String,
      required: true,
    },
    IsMailVerified: {
      type: Boolean,
      required: true,
      default: false,
    },
    PhoneNumber: {
      type: Number,
      required: true,
    },
    Password: {
      type: String,
      required: true,
    },

    ProfilePic: {
      type: String,
      required: true,
    },
    USER_ID: {
      type: String,
      required: true,
    },
    Gender: {
      type: String,
      required: function () {
        return this.UserType !== "org";
      },
    },

    BirthDate: {
      type: Date,
      required: function () {
        return this.UserType !== "org";
      },
    },

    Posts: {
      type: Array,
    },
    Resume: {
      type: String,
      required: function () {
        return this.UserType === "seeker";
      },
    },

    JobRole: {
      type: String,
      required: function () {
        return this.UserType === "seeker";
      },
    },
    CompanyName: {
      type: String,
      required: function () {
        return this.UserType === "recruiter";
      },
    },
    Position: {
      type: String,
      required: function () {
        return this.UserType === "recruiter";
      },
    },
    Education: { type: String },
    Experience: {
      type: Number,
    },
    About: {
      type: String,
    },
  },
  { timestamps: true }
);
const Users = mongoose.model("Users", UserSchema);
export default Users;
