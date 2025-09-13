import mongoose from "mongoose";
const jobSchema = new mongoose.Schema(
  {
    Sector: {
      type: String,
      required: true,
    },

    Industry: {
      type: String,
      required: true,
    },

    Department: {
      type: String,
      required: true,
    },
    Vacancies: {
      type: Number,
      required: true,
    },
    Education: {
      type: String,
      // required: true,
    },
    ProfilePic: {
      type: String,
      required: true,
    },
    CreatedBy: {
      type: String,
      required: true,
    },
    CreatorType: {
      type: String,
      required: true,
    },

    CreatorInfo: {
      type: String,
      required: true,
    },
    CompanyName: {
      //A company for which recruiter is hiring
      type: String,
      required: function () {
        return this.CreatorType === "recruiter";
      },
    },
    JobType: {
      //internship, Full Time, Contract
      type: String,
      required: true,
    },
    Paid: {
      type: String,
      required: true,
    },
    InternSalary: {
      type: Number,
      required: function () {
        return this.JobType === "intern" && this.Paid === "yes";
      },
    },
    Venue: {
      //whether remote, onsite or hybrid
      type: String,
    },
    Cities: {
      type: Array,
      required: true,
    },

    Title: {
      type: String,
      required: true,
    },
    Experience: {
      type: String,
      required: true,
    },
    MustHaveSkills: {
      type: Array,
      required: true,
    },
    GoodToHaveSkills: {
      type: Array,
      required: true,
    },
    SalaryToDisclose: {
      type: String,
      required: true,
    },
    Salary: {
      type: Number,
      required: function () {
        return this.SalaryToDisclose === "yes" && this.JobType !== "intern";
      },
    },

    Preference: {
      type: String,
      required: true,
    },

    About: {
      type: String,
      required: true,
    },
    isFeatJob: {
      type: Boolean,
    },
  },

  { timestamps: true }
);
const Jobs = mongoose.model("Jobs", jobSchema);
export default Jobs;
