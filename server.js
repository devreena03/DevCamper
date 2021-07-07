const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const color = require("colors");
const fileupload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const cors = require("cors");

//load the config
dotenv.config({ path: "./config/config.env" });

//route files
const bootcamps = require("./routes/bootcamps");
const courses = require("./routes/courses");
const auth = require("./routes/auth");
const reviews = require("./routes/reviews");
const users = require("./routes/users");

const logger = require("./middlewares/logger");
const connectDb = require("./config/db");
const error = require("./middlewares/error");

connectDb();

const app = express();

//middleware
//app.use(logger);

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// File uploading
app.use(fileupload());

// Sanitize data - nosql injection prevent
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Prevent cross site scripting XSS attacks
app.use(xss());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 10,
});
//all request togather
app.use(limiter);

// Prevent http param pollution
app.use(hpp());

// Enable CORS
app.use(cors());

// Set static folder
app.use(express.static(path.join(__dirname, "public")));
app.get("/", (req, res) =>
  res.sendFile(__dirname + "/public/views/index.html")
);
// Mount routers
app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);
app.use("/api/v1/auth", auth);
app.use("/api/v1/reviews", reviews);
app.use("/api/v1/users", users);
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
