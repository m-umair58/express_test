const express = require('express');
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
    const err = new Error(`Can't find the ${req.originalUrl} on server`);
    err.status = 'fail',
    err.statusCode = 404
    next(err);
})

// global error handling middleware
app.use((error,req,res,next)=>{
    error.statusCode = error.statusCode || 500;
    error.status = error.status || 'Error';
    res.status(error.statusCode).json({
        status:error.statusCode,
        message:error.message
    });
})

module.exports = app