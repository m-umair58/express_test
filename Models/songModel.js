const mongoose = require("mongoose")

const songSchema = new mongoose.Schema({
    title:{
        type:String,
        required:[true,'Title is required...!'],
        unique:true,
        trim:true
    },
    artist:{
        type:String,
        required:[true,'Artist is required...!']
    },
    duration:{
        type:Number,
        required:[true,'Duration is required...!']
    },
    releaseYear:{
        type:Number,
        required:[true,'Release Year is required...!']
    },
    genre:{
        type:String,
        required:[true,'Genre is required...!']
    },
    album:{
        type:String,
        required:[true,'Album is required...!']
    },
    coverImage:{
        type:String,
        required:[true,'Cover Image is required...!']
    },
    fileUrl:{
        type:String,
        required:[true,'File URL is required...!']
    },
    lyrics:{
        type:String,
        required:[true,'Lyrics is required...!']
    },
    tags:{
        type:Array,
        required:[true,'Tags is required...!']
    },
    views:{
        type:Number,
        default:0
    },
    likes:{
        type:Number,
        default:0
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        select:false // this is if we dont want to show this data
    }
})

const Song = mongoose.model("Song",songSchema);

module.exports = Song;