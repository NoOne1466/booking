const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
// const hpp = require("hpp");
const cookieParser = require("cookie-parser");
const compression = require("compression");
const path = require("path");
const AppError = require("./utils/appError");
const session = require("express-session");
const passport = require("passport");
const cors = require("cors");

const app = express();

app.use(cors());

//
app.set("view engine", "ejs");

// Middleware
app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: "SECRET",
  })
);
app.use(passport.initialize());
app.use(passport.session());

//

app.use(express.static(path.join(__dirname, "public")));

// app.set('views', path.join(__dirname, 'views'));

// 1) GLOBAL MIDDLEWARES
// Serving static files
// app.use(express.static(path.join(__dirname, 'public')));

// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});

app.use("/api", limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// // Prevent parameter pollution
// app.use(
//   hpp({
//     whitelist: [
//       "duration",
//       "ratingsQuantity",
//       "ratingsAverage",
//       "maxGroupSize",
//       "difficulty",
//       "price",
//     ],
//   })
// );

app.use(compression());
// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.requestTime);
  next();
});

// 3) ROUTES
// app.use("/", viewRouter);
app.head("/check", (req, res) => {
  res.status(200).send();
});

const userRouter = require("./user/user.routes");
const hotelsRouter = require("./hotels/hotels.routes");
const bookingRouter = require("./bookingRoom/bookingRoom.routes");
const PlaneRouter = require("./planes/planes.routes");
const flightRouter = require("./flights/flight.routes");

app.use("/api/v1/users", userRouter);
app.use("/api/v1/hotels", hotelsRouter);
app.use("/api/v1/booking", bookingRouter);
app.use("/api/v1/plane", PlaneRouter);
app.use("/api/v1/flight", flightRouter);

const updateRoomAvailability = require("./services/cron");
updateRoomAvailability();

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use((err, req, res, next) => {
  // console.log(err);
  res.status(err.statusCode || 500).json({
    status: err.status,
    message: err.message,
    error: err,
  });
});
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // Allow all origins
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS"); // Allow methods
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  ); // Allow headers
  next();
});

module.exports = app;
