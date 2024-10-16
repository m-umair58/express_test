const express = require('express');
const CustomError = require('./Utils/CustomErrors.js')
const globalErrorHandler = require('./Controller/errorController.js')
let morgan = require('morgan')

const moviesRouter = require('./Routes/moviesRoutes.js')

let app = express();

const logger = function(req,res,next){
    console.log("Custom middleware has been called...!");
    next();
}

app.use(express.json())// this is a middleware. we use this to get body in request 
if(process.env.NODE_ENV ==="development")
{
    app.use(morgan('dev'))
}
app.use(express.static('./public'))
app.use(logger)
app.use((req,res,next)=>{
    req.requestedAt = new Date().toISOString();
    next();
})

app.use('/api/v1/movies',moviesRouter);
app.all('*',(req,res,next)=>{
    // res.status(404).json({
    //     status:"Failed...!",
    //     message:`Can't find the ${req.originalUrl} on server`
    // });
    const err = new CustomError(`Can't find the ${req.originalUrl} on server!`,404)
    next(err);
})

// global error handling middleware
app.use(globalErrorHandler)

module.exports = app