const mongoose = require("mongoose")

const movieSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Name is required...!'],
        unique:true,
        trim:true
    },
    description:{
        type:String,
        required:[true,'description is required...!'],
        trim:true
    },
    duration:{
        type:Number,
        required:[true,'Duration is required...!']
    },
    rating:{
        type:Number,
        default:1.0
    },
    totalRating:{
        type:Number,
        required:[true,'ToralRating is a required field...!']
    },
    releaseYear:{
        type:Number,
        required:[true,"Release year is a required field...!"]
    },
    releaseDate:{
        type :Date,
        required:[true,"Date is a required field...!"]
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    genre:{
        type:[String],
        required:[true,"Genre is a required field...!"]
    },
    directors:{
        type:[String],
        required:[true,"directors is a required field...!"]
    },
    coverImage:{
        type:String,
        required:[true,"directors is a required field...!"]
    },
    actors:{
        type:[String],
        required:[true,"Actors is a required field...!"]
    },
    price:{
        type:Number,
        required:[true,"Price is required field...!"]
    }
});

const Movie = mongoose.model('Movie',movieSchema);

module.exports = Movie
// const testMovie = new Movie({
//     name:"Die Hard",
//     description:"Awesome movie",
//     duration:130,
//     rating:5.0
// })

// testMovie.save().then(doc =>{
//     console.log(doc);
// })
// .catch(err=>{
//     console.log(err);
// });
