const Movie = require('./../Models/movieModels')


// api handler functions
exports.getMovieById = (req,res)=>{

}

exports.getAllMovies = (req,res)=>{
    
}

exports.updateMovie = (req,res)=>{
    
}

exports.createMovie = async (req,res)=>{
    try{
        const movie = await Movie.create(req.body);

        res.status(201).json({
            status:"Successfull",
            data:{
                movie
            }
        })
    }catch(err){
        res.status(400).json({
            status:"Failed...!",
            message:err.message
        })
    }
}

exports.deleteMovieById = (req,res)=>{
    
};
