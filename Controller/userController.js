const User = require('./../Models/userModel');
const asyncErrorHandler = require('./../Utils/asyncErrorHandler');
const jwt  = require('jsonwebtoken');
const CustomError = require('./../Utils/CustomErrors')
const util =require('util');
const sendEmail = require('./../Utils/email');
const { log } = require('console');
const crypto = require('crypto')
const authController = require('./authController')

exports.getAllUsers = asyncErrorHandler(async(req,res,next)=>{
    const users = await User.find();

    res.status(200).json({
        status:"success",
        length:users.length,
        data:{
            users
        }
    })
})

const filterReqObj = (obj,...allowedFields)=>{
    const newObj = {};
    Object.keys(obj).forEach(prop=>{
        if(allowedFields.includes(prop)){
            newObj[prop] = obj[prop];
        }
    })
    return newObj;
}

exports.updatePassword = asyncErrorHandler(async(req,res,next)=>{
    // Get current user from database

    const user = await User.findById(req.user.id).select('+password');

    if(!(await user.comparePassword(req.body.currentPassword,user.password))){
        return next(new CustomError("Current password is wrong",401));
    }

    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    await user.save();

    authController.createSendResponse(user,200,res);
})

exports.updateMe = asyncErrorHandler(async(req,res,next)=>{
    if(req.body.password || req.body.confirmPassword){
        return next(new CustomError("Request body should not contain password...!",400))
    }

    const filterObj = filterReqObj(req.body,'name','email');
    const updatedUser = await User.findByIdAndUpdate(req.user.id,filterObj,{runValidators:true , new:true});
    res.status(200).json({
        status:"success",
        data:{
            user:updatedUser
        }
    })
});

exports.deleteMe = asyncErrorHandler(async(req,res,next)=>{
    await User.findByIdAndUpdate(req.user.id,{active:false});

    res.status(204).json({
        status:"success",
        data:null
    })
})