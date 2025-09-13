//3rd party
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
//Internal/user defined
import dbConnectionMongoose from "./src/config/dbConfig.js";
import { errorHandler } from "./src/middlewares/errorHandler.js";
import routeNoteFound from "./src/middlewares/notFound.js";
import { PORT } from "./src/config/env.js";

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",

    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("<h1>This is the backend</h1>");
});

// app.use('/api/user',)
app.use(routeNoteFound);
app.use(errorHandler);

app.listen(PORT, () => {
  dbConnectionMongoose();
  console.log(`Serer running at http://localhost:${PORT}`);
});
