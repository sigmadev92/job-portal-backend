import express from "express";
import Jobs from "../Models/Job.js";

const JobRouter = express.Router();

JobRouter.get("/", (req, res) => {
  res.json(req.headers);
});

JobRouter.post("/add", async (req, res) => {
  console.log("Arrived at POST backend/jobs/add");
  if (
    req.body.About.length >= 1000 &&
    req.body.Vacancies >= 50 &&
    (req.body.CreatorType === "org" || req.body.PosterExp >= 10)
  ) {
    //feat job

    console.log("A featured job");
    req.body.isFeatJob = true;
  }
  try {
    const newJob = await Jobs(req.body);
    await newJob.save();
    return res.send({
      status: true,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: false,
      message: error.message,
    });
  }
});

JobRouter.get("/get-all", async (req, res) => {
  try {
    const jobs = await Jobs.find();
    return res.send({
      status: true,
      data: jobs,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: false,
      message: "ERR_DB_CONN",
    });
  }
});

JobRouter.post("/get-jobs", async (req, res) => {
  console.log(`${Date()} ${req.body.task}`);
  try {
    const response = await Jobs.find({
      _id: { $in: req.body.jobIds },
    });
    console.log(response.length);
    return res.send({
      status: true,
      data: response,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: false,
    });
  }
});

JobRouter.get("/feat-jobs/:job_role", async (req, res) => {
  console.log("reached at GET backend/jobs/feat-jobs");
  const prefJob = req.params.job_role;
  try {
    const featJobs = await Jobs.find({
      $and: [
        { isFeatJob: true },
        { Title: { $regex: prefJob, $options: "i" } },
      ],
    });

    res.send({
      status: true,
      data: featJobs,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: false,
      message: error.message,
    });
  }
});

JobRouter.get("/search-jobs/:jobTitle", async (req, res) => {
  console.log("Arrived on GET/backend/jobs/search-jobs");
  const srch = req.params.jobTitle;
  try {
    const searchedJObs = await Jobs.find({
      $or: [
        { Cities: { $regex: srch, $options: "i" } },
        { Title: { $regex: srch, $options: "i" } },
      ],
    });
    res.send({
      status: true,
      data: searchedJObs,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: false,
      message: error.message,
    });
  }
});

JobRouter.get("/get-posted-jobs/:user_id", async (req, res) => {
  console.log(`Reached at Job Postings `, req.params.user_id);
  try {
    const response = await Jobs.find({ CreatorInfo: req.params.user_id });
    console.log(response.length);
    return res.send({
      status: true,
      data: response,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: false,
      message: error.message,
    });
  }
});

JobRouter.delete("/delete-job-post/:job_id", async (req, res) => {
  console.log(`Id to be deleted ${req.params.job_id}`);
  try {
    const response = await Jobs.deleteOne({ _id: req.params.job_id });
    console.log(response);
    if (response.deletedCount === 1)
      return res.send({
        status: true,
      });

    return res.send({
      status: false,
      message: "Cannot be deleted",
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: false,
      message: error.message,
    });
  }
});

JobRouter.get("/get-details/:jobId", async (req, res) => {
  console.log("Time : ", new Date().getHours());
  console.log("Task : To get Full details of a particular job");

  try {
    const response = await Jobs.findOne({ _id: req.params.jobId });
    if (response) {
      return res.send({
        status: true,
        data: response,
      });
    }
    res.send({
      status: false,
      message: "INVALID_JOBID",
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: false,
      message: error.message,
    });
  }
});
export default JobRouter;
