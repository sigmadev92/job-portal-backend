import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import dbConfig from "./Config/dbConfig.js";
import UserRouter from "./Routes/UserRouter.js";
import JobRouter from "./Routes/JobsRoute.js";
import JobActionRouter from "./Routes/JobActionsRouter.js";
import logger from "./Config/logging.js";
import morgan from "morgan";
import path from "path";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 1008;
app.use(
  cors({
    origin: "http://localhost:3000",

    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/users", UserRouter);
app.use("/jobs", JobRouter);
app.use("/job-actions", JobActionRouter);
dbConfig.dbConnection();

const morganFormat = ":method :url :status :response-time ms";
const dirName = path.resolve();
app.use(express.static(path.join(dirName, "/frontend/dist")));
app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);

app.listen(PORT, () =>
  console.log("SERVER RUNNING AT " + "http://localhost:" + PORT)
);
app.use(express.static("profilepics"));
app.use(express.static("resumes"));
app.get("/", (req, res) => {
  res.send("<h1>This is the backend</h1>");
});
