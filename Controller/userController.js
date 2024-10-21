const User = require('./../Models/userModel');
const asyncErrorHandler = require('./../Utils/asyncErrorHandler');
const jwt  = require('jsonwebtoken');
const CustomError = require('./../Utils/CustomErrors')
const util =require('util');
const sendEmail = require('./../Utils/email');
const { log } = require('console');
const crypto = require('crypto')
const authController = require('./authController')


exports.updatePassword = asyncErrorHandler(async(req,res,next)=>{
    // Get current user from database

    const user = await User.findById(req.user._id).select('+password');

    if(!(await user.comparePassword(req.body.currentPassword,user.password))){
        return next(new CustomError("Current password is wrong",401));
    }

    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    await user.save();

    authController.createSendResponse(user,200,res);
})