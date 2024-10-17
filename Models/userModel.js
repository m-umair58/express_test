const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs')

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
            message:"Password and confirm password doesn;t match...!"
        }
    },
    passwordChangedAt: Date
})

userSchema.pre('save',async function(next){
    if(!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password,12);

    this.confirmPassword = undefined;
    next();
})

userSchema.methods.comparePassword = async function(pass, passDb) {
  return await bcrypt.compare(pass, passDb);
};

userSchema.methods.isPasswordChanged = async function(JWTTimestamp){
    if(this.passwordChangedAt){
        const pwdChangedTimeStamp = parseInt(this.passwordChangedAt.getTime()/1000,10);
        // console.log(pwdChangedTimeStamp,JWTTimestamp);

        return JWTTimestamp < pwdChangedTimeStamp;
    }
    return false;    
}

const User = mongoose.model("User",userSchema);

module.exports = User;