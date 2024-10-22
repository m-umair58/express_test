const devError = (res,error)=>{
    res.status(error.statusCode).json({
        status:error.statusCode,
        message:error.message,
        stackTrace:error.stack,
        error:error
    });
}

const prodError = (res,error)=>{
    if(error.isOperationa){
        res.status(error.statusCode).json({
            status:error.statusCode,
            message:error.message
        });
    }else{
        res.status(200).json({
            status:"error",
            message:"Something went wrong please try again later...!"
        })
    }
}

module.exports = (error,req,res,next)=>{
    error.statusCode = error.statusCode || 500;
    error.status = error.status || 'Error';
    if(process.env.NODE_ENV === 'development'){
        devError(res,error);
    }else if(process.env.NODE_ENV === 'production'){
        prodError(res,error);
    }
}