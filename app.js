const express = require('express');
const CustomError = require('./Utils/CustomErrors.js')
const globalErrorHandler = require('./Controller/errorController.js')
let morgan = require('morgan')

const moviesRouter = require('./Routes/moviesRoutes.js');
const authRouter = require('./Routes/authRouter.js')


let app = express();


app.use(express.json())// this is a middleware. we use this to get body in request 
if(process.env.NODE_ENV ==="development")
{
    app.use(morgan('dev'))
}
app.use(express.static('./public'))


app.use('/api/v1/movies',moviesRouter);
app.use('/api/v1/users',authRouter);

app.all('*',(req,res,next)=>{
    const err = new CustomError(`Can't find the ${req.originalUrl} on server!`,404)
    next(err);
})

// global error handling middleware
app.use(globalErrorHandler)

module.exports = app