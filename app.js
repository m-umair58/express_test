const express = require('express');
let morgan = require('morgan')

const moviesRouter = require('./Routes/moviesRoutes.js')

let app = express();

const logger = function(req,res,next){
    console.log("Custom middleware has been called...!");
    next();
}

app.use(express.json())// this is a middleware. we use this to get body in request 
app.use(morgan('dev'))
app.use(logger)
app.use((req,res,next)=>{
    req.requestedAt = new Date().toISOString();
    next();
})

app.use('/api/v1/movies',moviesRouter)

module.exports = app