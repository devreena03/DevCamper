const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const color = require("colors");
const fileupload = require("express-fileupload");
//load the config
dotenv.config({ path: "./config/config.env" });

//route files
const bootcamps = require("./routes/bootcamps");
const courses = require("./routes/courses");
const logger = require("./middlewares/logger");
const connectDb = require("./config/db");
const error = require("./middlewares/error");

connectDb();

const app = express();

//middleware
//app.use(logger);

//Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(express.json());
// File uploading
app.use(fileupload());

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);
app.use(error);
//express router

const port = process.env.PORT || 5000;

const server = app.listen(port, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${port}!`.yellow
      .bold
  );
});
//UnhandledPromiseRejection
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => {
    console.log("closing server");
    process.exit(1);
  });
});
