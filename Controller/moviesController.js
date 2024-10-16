const Movie = require('./../Models/movieModels')
const ApiFeatures = require('./../Utils/ApiFeatures')

exports.getHighestRated = (req,res,next)=>{
    req.query.limit = 1;
    req.query.sort = '-rating';
    next();
}
// api handler functions
exports.getMovieById = async (req,res)=>{
    try{
        // const movie = await Movie.find({_id:req.params.id});
        const movie = await Movie.findById(req.params.id);
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

exports.getAllMovies = async (req,res)=>{
    try{
        const features = new ApiFeatures(Movie.find(),req.query).filter().sort().fields().paginate();
        let movies = await features.query;

        res.status(200).json({
            status:"Successfull",
            length:movies.length,
            data:{
                movies
            }
        })
    }catch(err){
        res.status(400).json({
            status:"Failed...!",
            message:err.message
        })
    }
}

exports.updateMovie = async(req,res)=>{
    try{
        const updatedMovies = await Movie.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});

        res.status(201).json({
            status:"Successfull",
            data:{
                movies:updatedMovies
            }
        })
    }catch(err){
        res.status(400).json({
            status:"Failed...!",
            message:err.message
        })
    }
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

exports.deleteMovieById = async (req,res)=>{
    try{
        await Movie.findByIdAndDelete(req.params.id);

        res.status(204).json({
            status:"Successfull",
            data:null
        })
    }catch(err){
        res.status(404).json({
            status:"Failed...!",
            message:err.message
        })
    }
};
