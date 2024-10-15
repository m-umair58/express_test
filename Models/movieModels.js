const mongoose = require("mongoose")

const movieSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Name is required...!'],
        unique:true
    },
    description:String,
    duration:{
        type:Number,
        required:[true,'Duration is required...!']
    },
    rating:{
        type:Number,
        default:1.0
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
