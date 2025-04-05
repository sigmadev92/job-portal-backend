import express from "express";
import JobActions from "../Models/JobActions.js";
const JobActionRouter = express.Router();

JobActionRouter.get("/", (req, res) => {
  res.send("<p>reached basic route of 3) job actions</p>");
});

JobActionRouter.get("/get-all-records", async (req, res) => {
  try {
    const response = await JobActions.find();
    res.send({
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

JobActionRouter.post("/add-record", async (req, res) => {
  console.log("Reached baseurl/job-actions/add-record");
  console.log(req.body);
  try {
    const newAction = await JobActions(req.body);
    await newAction.save();

    const savedRecord = await JobActions.findOne(req.body);
    res.send({
      status: true,
      data: savedRecord,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: false,
      message: error.message,
    });
  }
});

JobActionRouter.delete("/remove-saved-job/:record_id", async (req, res) => {
  console.log("Reached baseurl/job-actions/remove-saved-job");
  try {
    const response = await JobActions.deleteOne({ _id: req.params.record_id });
    console.log(response);

    res.send({
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
export default JobActionRouter;
