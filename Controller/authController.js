const User = require('./../Models/userModel');
const asyncErrorHandler = require('./../Utils/asyncErrorHandler');
const jwt  = require('jsonwebtoken');
const CustomError = require('./../Utils/CustomErrors')
const util =require('util');

const signToken = id =>{
    return jwt.sign({id},process.env.SECRERT_STR,{
        expiresIn: process.env.LOGIN_EXPIRES
    })
}

exports.signup = asyncErrorHandler(async(req,res,next)=>{
    const newUser = await User.create(req.body);

    const token = signToken(newUser._id);

    res.status(201).json({
        status:'Successfull',
        token,
        data:{
            user:newUser
        }
    })
});

exports.login = asyncErrorHandler(async(req,res,next)=>{
    const email = req.body.email;
    const password = req.body.password;

    // const {email,password} = req.body; // (object destructuring syntax) to do the same this as above
    
    if(!email || !password){
        const error = new CustomError("Please provide Email and password to login...!",400);
        return next(error);
    }
    const user = await User.findOne({email}).select('+password'); // .select('+password') wrote this line because we explicitly set select false in user model

    const isMatch = await user.comparePassword(password,user.password);
    if(!user||!isMatch){
        const error = new CustomError("Invalid email or password...!",400)
        return next(error);
    }
    
    const token = signToken(user._id);

    res.status(200).json({
        status:"success",
        token,
        user
    })
});

exports.protect = asyncErrorHandler(async(req,res,next)=>{
    // 1. read the token and see if it exists
    const testToken = req.headers.authorization;
    let token ;
    if(testToken&&testToken.startsWith('bearer')){
        token = testToken.split(' ')[1];
    }
    if(!token){
        next(new CustomError("You are not logged in....!",401))
    }

    // 2. validate the token
    const decodedToken = await util.promisify(jwt.verify)(token,process.env.SECRERT_STR);

    console.log(decodedToken);

    // 3. verify the user still exists

    const user = await User.findById(decodedToken.id);

    if(!user){
        const error = new CustomError("The user with given token doesn't exists",401)
        next(error)
    }
    // 4. if the user has changed the password login again

    const isPasswordChanged = await user.isPasswordChanged(decodedToken.iat);
    console.log(isPasswordChanged);
    if(isPasswordChanged){
        const error = new CustomError("Password has been changed please login again...!",401)
        return next(error);
    }

    // 5. assign user

    req.user = user;

    next();
})