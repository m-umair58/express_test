const User = require('./../Models/userModel');
const asyncErrorHandler = require('./../Utils/asyncErrorHandler');
const jwt  = require('jsonwebtoken');
const CustomError = require('./../Utils/CustomErrors')
const util =require('util');
const sendEmail = require('./../Utils/email');
const { log } = require('console');
const crypto = require('crypto');

const signToken = (id) =>{
    return jwt.sign({id},process.env.SECRERT_STR,{
        expiresIn: process.env.LOGIN_EXPIRES
    })
}

const createSendResponse = (user,statusCode,res)=>{
        const token = signToken(user._id);

        const options = {
            maxAge:process.env.LOGIN_EXPIRES,
            httpOnly:true
        }
        
        if(process.env.NODE_ENV ==='production'){
            options.secure = true;
        }

        res.cookie('jwt',token,options);

        user.password = undefined // this is not going to change password in db as undefined but just not to show in response
        
        res.status(200).json({
            status:"success",
            token,
            data:{
                user
            }
        })
    }

exports.signup = asyncErrorHandler(async(req,res,next)=>{
    const newUser = await User.create(req.body);

    createSendResponse(newUser,201,res);
});

exports.login = asyncErrorHandler(async(req,res,next)=>{
    try {
        // Log the incoming request
        console.log('Login request body:', req.body);

        const {email, password} = req.body;
        
        if(!email || !password){
            console.log('Missing email or password');
            return res.status(400).json({
                status: "fail",
                message: "Please provide Email and password to login...!"
            });
        }

        const user = await User.findOne({email}).select('+password');

        if(!user){
            console.log('User not found');
            return res.status(401).json({
                status: "fail",
                message: "Invalid email or password...!"
            });
        }

        const isMatch = await user.comparePassword(password, user.password);
        if(!isMatch){
            console.log('Password mismatch');
            return res.status(401).json({
                status: "fail",
                message: "Invalid email or password...!"
            });
        }
        
        req.session.user = {
            id: user._id,
            email: user.email
          };
        
        console.log('Login successful');
        return createSendResponse(user, 200, res);
        
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({
            status: "error",
            message: "An error occurred during login",
            error: error.message
        });
    }
});

exports.protect = asyncErrorHandler(async(req,res,next)=>{
    // 1. read the token and see if it exists
    const testToken = req.headers.authorization;
    let token ;
    if(testToken&&testToken.startsWith('Bearer')){
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
    // console.log(isPasswordChanged);
    if(isPasswordChanged){
        const error = new CustomError("Password has been changed please login again...!",401)
        return next(error);
    }

    // 5. assign user

    req.user = user;

    next();
});

exports.restrict = (role)=>{
    return (req,res,next)=>{
        if(req.user.role !== role){
            const error = new CustomError("You don't have permission to perform this action",401);
            next(error);
        }
        next();
    }
}

exports.forgotPassword = asyncErrorHandler(async (req,res,next)=>{
    // 1. Get user based on posted email

    const user = await User.findOne({email:req.body.email});

    if(!user){
        const error = new CustomError("Given email not found",404);
        return next(error);
    }
    // Generate random reset token
    const resetToken = await user.createResetPasswordToken();
    console.log(resetToken)
    await user.save({validateBeforeSave:false});

    // Send token back to user email
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
    const message = `We have received a Password Reset request. Please use the below link to reset your password\n\n${resetUrl}\n\nThis url will be valide only for 10 mins`;
    try{
        await sendEmail({
            email:user.email,
            subject:"password change request received ",
            message:message
        });
        res.status(200).json({
            status:"scucess",
            message:"Password reset link has been sent to the user."
        })
    }catch(err){
        user.passwordResetToken=undefined;
        user.passwordResetTokenExpires=undefined;
        user.save({validateBeforeSave:false});

        return next(new CustomError("There was an error occured while sending the password reset email. Please try again later. ",500));
    }
})

exports.resetPassword = asyncErrorHandler(async (req,res,next)=>{
    const token = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({passwordResetToken:token,passwordResetTokenExpires:{$gt:Date.now()}});

    if(!user){
        const error =new CustomError("Token is invalid or has Expired...!",400)
        next(error);
    }
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    user.passwordChangedAt=  Date.now();

    user.save();
    createSendResponse(user,200,res);
});


module.exports.createSendResponse = createSendResponse;
