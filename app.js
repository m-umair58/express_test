require("./instrument.js");
const Sentry = require("@sentry/node");


const rate_limit= require('express-rate-limit');
const helmet = require('helmet');
const sanitise = require('express-mongo-sanitize');
const xss = require('xss-clean')

const express = require('express');
const CustomError = require('./Utils/CustomErrors.js')
const globalErrorHandler = require('./Controller/errorController.js')
let morgan = require('morgan')

const moviesRouter = require('./Routes/moviesRoutes.js');
const authRouter = require('./Routes/authRouter.js')
const userRouter = require('./Routes/userRouter.js');


let app = express();

app.use(helmet());
const limiter = rate_limit({
    max:1000,
    windowMs:60*60*1000,
    message:"Received to many requests from this ip please try again after 1 hour"
}); // this middleware function is to limit the same ip from logging in again and again

app.use('/api',limiter)

app.use(express.json({limit:'10kb'}))// this is a middleware. we use this to get body in request 
// added limit just to limit the data received in request body and to prevent ddos attack

app.use(sanitise());
app.use(xss());

if(process.env.NODE_ENV ==="development")
{
    app.use(morgan('dev'))
}
app.use(express.static('./public'))


app.use('/api/v1/movies',moviesRouter);
app.use('/api/v1/auth',authRouter);
app.use('/api/v1/user',userRouter);

// app.all('*',(req,res,next)=>{
//     const err = new CustomError(`Can't find the ${req.originalUrl} on server!`,404)
//     next(err);
// })
Sentry.setupExpressErrorHandler(app);
// global error handling middleware
app.use(globalErrorHandler)

module.exports = app