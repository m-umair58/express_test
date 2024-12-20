require("./instrument.js");
const Sentry = require("@sentry/node");
const jwt = require('jsonwebtoken');
const session = require('express-session');

//ejs related
const cors = require("cors");
const path = require("path");
const expressLayout = require("express-ejs-layouts");

const rate_limit = require("express-rate-limit");
const helmet = require("helmet");
const sanitise = require("express-mongo-sanitize");
const xss = require("xss-clean");

const express = require("express");
const CustomError = require("./Utils/CustomErrors.js");
const globalErrorHandler = require("./Controller/errorController.js");
let morgan = require("morgan");

const moviesRouter = require("./Routes/moviesRoutes.js");
const songsRouter = require("./Routes/songsRouter.js");
const authRouter = require("./Routes/authRouter.js");
const userRouter = require("./Routes/userRouter.js");

const asyncErrorHandler = require('./Utils/asyncErrorHandler');
const User = require('./Models/userModel');
const { signToken, login } = require('./Controller/authController');

let app = express();

// Add cookie-parser and body parsing middleware EARLY in the middleware chain
const cookieParser = require('cookie-parser');
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));
const mongoose = require("mongoose");

const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
// console.log(process.env);
const port = process.env.PORT || 8000;
console.log(process.env.CONN_STR);
mongoose
  .connect(process.env.CONN_STR)
  .then((result) => {
    app.listen(port);
    console.log("Listening to port 2525 and database is connected!");
  })
  .catch((err) => console.log(err));

// EJS setup

app.use(cors());
app.use(expressLayout);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// ejs materail

const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  }
  res.redirect('/auth/login');
};

// Protected routes
app.get('/movies', isAuthenticated, (req, res) => {
  
  res.render("movies");
});

// Login route handler
app.get('/auth/login', (req, res) => {
  const redirect = req.query.redirect || '/';
  res.render('login', {
    redirect,
    path: '/auth/login',
    pageTitle: 'Login',
    isAuthenticated: isAuthenticated, // or req.isAuthenticated() if you have that middleware
    errorMessage: null,
    layout: false
  });
});

app.get("/movies/:id", isAuthenticated,(req, res) => {
  res.render("oneMovie", { id: req.params.id });
});
app.get("/signup", (req, res) => {
  res.render("signup",{
    layout: false
  });
});
app.get(["/", "/home"], (req, res) => {
  res.render("home");
});
app.get("/songs",isAuthenticated, (req, res) => {
  res.render("songs");
});


// Security
app.use(helmet());
const limiter = rate_limit({
  max: 1000,
  windowMs: 60 * 60 * 1000,
  message:
    "Received to many requests from this ip please try again after 1 hour",
}); // this middleware function is to limit the same ip from logging in again and again

app.use("/api", limiter);

app.use(express.json({ limit: "10kb" })); // this is a middleware. we use this to get body in request
// added limit just to limit the data received in request body and to prevent ddos attack

app.use(sanitise());
app.use(xss());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(express.static("./public"));

app.use("/api/v1/movies", moviesRouter);
app.use("/api/v1/songs", songsRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);

// app.all('*',(req,res,next)=>{
//     const err = new CustomError(`Can't find the ${req.originalUrl} on server!`,404)
//     next(err);
// })
Sentry.setupExpressErrorHandler(app);
// global error handling middleware
app.use(globalErrorHandler);



module.exports = app;
