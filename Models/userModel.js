const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please enter your name...!"],
    },
    email:{
        type:String,
        required:[true,"Please enter your email...!"],
        unique:true,
        lowercase:true,
        validate:[validator.isEmail,"Please Enter a valide Email"]
    },
    photo:String,
    password:{
        type:String,
        required:[true,"Please Enter a password...!"],
        minLength:8,
        select:false  // this make sures that we dont receive this field when we access users data
    },
    confirmPassword:{
        type:String,
        required:[true,"Please Enter a password...!"],
        validate:{
            validator:function(val){
                return val==this.password;
            },
            message:"Password and confirm password doesn't match...!"
        }
    },
    role:{
        type:String,
        enum:["user","admin"],
        default:"user"
    },
    active:{
        type:Boolean,
        default:true,
        select:false
    },
    passwordChangedAt: Date,
    passwordResetToken:String,
    passwordResetTokenExpires:Date

})

userSchema.pre('save',async function(next){
    if(!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password,12);

    this.confirmPassword = undefined;
    next();
})

userSchema.pre(/^find/,function(next){
    this.find({active:{$ne:false}});
    next();
})

userSchema.methods.comparePassword = async function(candidatePassword, userPassword) {
    try {
        return await bcrypt.compare(candidatePassword, userPassword);
    } catch (error) {
        console.error('Password comparison error:', error);
        return false;
    }
};

userSchema.methods.isPasswordChanged = async function(JWTTimestamp){
    if(this.passwordChangedAt){
        const pwdChangedTimeStamp = parseInt(this.passwordChangedAt.getTime()/1000,10);
        // console.log(pwdChangedTimeStamp,JWTTimestamp);

        return JWTTimestamp < pwdChangedTimeStamp;
    }
    return false;    
}

userSchema.methods.createResetPasswordToken = async function(){
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetTokenExpires = Date.now() +10*60*1000;
    console.log(resetToken,this.passwordResetToken);
    return resetToken;
}


const User = mongoose.model("User",userSchema);

module.exports = User;
