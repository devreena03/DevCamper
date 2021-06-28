const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");

//route files
const bootcamps = require("./routes/bootcamps");
const logger = require("./middlewares/logger");

//load the config
dotenv.config({ path: "./config/config.env" });

const app = express();

//middleware
//app.use(logger);

//Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use("/api/v1/bootcamps", bootcamps);

//express router

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${port}!`
  );
});
